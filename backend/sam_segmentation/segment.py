import json
import os
import urllib.error
import urllib.request

import cv2
import numpy as np

from adapters.config import load
from adapters.keyvault import get_secrets
from image_processing.util.converter import (convertOpenCVToBase64,
                                             convertToOpenCVFormat)


def get_input_points_and_labes(img):
    h, w = img.shape[:2]
    offset_h = h // 20
    offset_w = w // 20
    offset_c = 2
    input_points = [
        [h // 2, w // 2],  # points inside lesion
        [h // 2 - offset_c, w // 2],
        [h // 2 + offset_c, w // 2],
        [h // 2, w // 2 - offset_c],
        [h // 2, w // 2 + offset_c],

        [offset_h, offset_w],  # background points in corners
        [h - offset_h, w - offset_w],
        [offset_h, w - offset_w],
        [h - offset_h, offset_w],
    ]
    input_labels = [1, 1, 1, 1, 1, 0, 0, 0, 0]
    return input_points, input_labels


def setup_request(img):
    img_str = convertOpenCVToBase64(img, False)
    input_points, input_labels = get_input_points_and_labes(img)
    data = {
        "input_data": {
            "columns": [
                "image",
                "input_points",
                "input_boxes",
                "input_labels",
                "multimask_output",
            ],
            "index": [0],
            "data": [[
                img_str,
                json.dumps(input_points),
                "",
                json.dumps(input_labels),
                False,
            ]],
        },
        "params": {},
    }
    body = str.encode(json.dumps(data))
    config = load()
    url = config['defaults']['azure']['samEndpoint']
    secrets = get_secrets()
    api_key = secrets['samEndpointKey']

    if not api_key:
        raise Exception("A key should be provided to invoke the endpoint")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': ('Bearer ' + api_key),
        'azureml-model-deployment': 'facebook-sam-vit-huge-1',
    }
    req = urllib.request.Request(url, body, headers)
    return req


def segment_online(img):
    """
    Performs segmentation using SAM and online endpoint
    """
    req = setup_request(img)

    try:
        response = urllib.request.urlopen(req)

        result_raw = response.read().decode("utf-8")
        result = json.loads(result_raw)
        prediction = result[0]['response']['predictions'][0]['masks_per_prediction'][0]
        msk_str = prediction['encoded_binary_mask']
        score = prediction['iou_score']
        sam_msk = convertToOpenCVFormat({'data': msk_str}, False)
        sam_gray = cv2.cvtColor(sam_msk, cv2.COLOR_BGR2GRAY)
        _th, msk = cv2.threshold(sam_gray, 128, 255, cv2.IMREAD_GRAYSCALE)
        return msk, score
    except urllib.error.HTTPError as error:
        print("The request failed with status code: " + str(error.code))

        # Print the headers - they include the requert ID and the timestamp,
        # which are useful for debugging the failure
        print(error.info())
        print(error.read().decode("utf8", 'ignore'))
        return None, 0
