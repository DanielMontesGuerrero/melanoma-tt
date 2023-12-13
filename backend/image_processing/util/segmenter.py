import os

import numpy as np
import torch
from segment_anything import SamPredictor, sam_model_registry


def segment(img, input_point=np.array([[150, 200]])):
    dire = os.path.dirname(os.path.abspath(__file__))
    filename = 'sam_vit_h_4b8939.pth'
    sam = sam_model_registry['vit_h'](checkpoint=os.path.join(dire, filename))

    device = "cuda" if torch.cuda.is_available() else "cpu"
    sam.to(device=device)

    predictor = SamPredictor(sam)
    predictor.set_image(img)

    input_point = np.array([
        [100, 100],  # point inside lesion

        [10, 10],  # background points in corners
        [90, 90],
        [10, 90],
        [90, 10],
    ])
    input_label = np.array([1, 0, 0, 0, 0])
    msks, scores, _ = predictor.predict(
        point_coords=input_point,
        point_labels=input_label,
        multimask_output=True,
    )
    results = zip(msks, scores)
    results = sorted(results, key=(lambda item: item[1]), reverse=True)
    msk = results[0][0]
    segmentation = np.asarray(msk, dtype="uint8")
    segmentation *= 255
    return segmentation, results[0][1]
