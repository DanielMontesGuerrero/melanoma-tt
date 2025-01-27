import json
import logging
import os
import urllib.request

import image_processing.processor as img_proc
from adapters.blob_storage import download_image
from adapters.keyvault import get_secrets
from image_processing.util.converter import (convertOpenCVToBase64,
                                             convertToOpenCVFormat)

CNN_NAME = "CNN_ENDPOINT_URL"
CNN_KEY = "CNN_API_KEY"


def verify_image_content(img, blob_name):
    if 'error' in img:
        result = {
            'error': f'Error with img: {blob_name} {img["error"]} ',
        }
        return result
    return None


def compare(blob_name_before, blob_name_after):
    img_before = download_image(blob_name_before)
    err_before = verify_image_content(img_before, blob_name_before)
    if err_before:
        return {
            'status': 500,
            'data': err_before,
        }

    img_after = download_image(blob_name_after)
    err_after = verify_image_content(img_after, blob_name_after)
    if err_after:
        return {
            'status': 500,
            'data': err_after,
        }

    logging.info("Downloaded images")

    result = img_proc.extract_and_compare(img_before, img_after)

    return {
        'status': 200,
        'data': result,
    }


def classify(raw_img):
    secrets = get_secrets()
    img = convertToOpenCVFormat({'data': bytes(raw_img, "utf-8")})
    img_str = convertOpenCVToBase64(img, encode='png')
    url = secrets["cnnEndpointUrl"]
    if url is None:
        return {
            'status': 500,
            'data': "CNN URL enviroment variable is not defined"
        }
    api_key = secrets["cnnApiKey"]
    if api_key is None:
        return {
            'status': 500,
            'data': "CNN API key enviroment variable is not defined"
        }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': (
            'Bearer ' + api_key)}
    body = {
        "Inputs": {
            "WebServiceInput0": [
                {
                    "image": img_str,
                    "id": 0,
                    "category": "melanoma"
                }]
        },
        "GlobalParameters": {}
    }
    req = urllib.request.Request(url, str.encode(json.dumps(body)), headers)
    result = {}
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        result["error"] = str(error.info())
        logging.error(
            "The request failed with status code: " + str(error.code))

        # Print the headers - they include the requert ID and the timestamp,
        # which are useful for debugging the failure
        logging.error(error.info())
        logging.error(error.read().decode("utf8", 'ignore'))

    return {
        'status': 500 if 'error' in result else 200,
        'data': {
            'img': raw_img,
            'score': result['Results']["WebServiceOutput0"][0]['Scored Probabilities_melanoma']
        }
    }


def extract(blob_name):
    img = download_image(blob_name)
    err = verify_image_content(img, blob_name)
    if err:
        return {
            'status': 500,
            'data': err,
        }
    result = img_proc.extract(img)
    return {
        'status': 200,
        'data': result,
    }


def dispatch(operation, blob_names):
    if operation == 'compare':
        blob_name_before = blob_names[0]
        blob_name_after = blob_names[1]
        return compare(blob_name_before, blob_name_after)
    if operation == 'classify':
        blob_name = blob_names[0]
        return classify(blob_name)
    if operation == 'extract':
        blob_name = blob_names[0]
        return extract(blob_name)
    return {
        'status': 400,
        'error': 'bad request',
    }
