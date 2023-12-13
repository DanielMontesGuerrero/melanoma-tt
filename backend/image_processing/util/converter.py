import base64

import cv2
import numpy as np


def convertToOpenCVFormat(image, contains_data_type=True):
    base64_string = image['data']
    if contains_data_type:
        base64_string = image['data'].split(b",")[1]
    image_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(image_data, np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    total_pixels = img.shape[0] * img.shape[1]
    if total_pixels > 600 * 600:
        scale_percent = 10  # percent of original size
        width = int(img.shape[1] * scale_percent / 100)
        height = int(img.shape[0] * scale_percent / 100)
        dim = (width, height)
        # resize image
        img = cv2.resize(img, dim, interpolation=cv2.INTER_AREA)
    return img


def convertOpenCVToBase64(img, include_data_type=True, encode='jpg'):
    img_str = base64.b64encode(cv2.imencode('.' + encode, img)[1]).decode()
    if not include_data_type:
        return img_str
    return f'data:image/{encode};base64,' + img_str
