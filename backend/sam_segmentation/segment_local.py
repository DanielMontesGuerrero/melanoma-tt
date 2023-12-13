import os

import numpy as np
from segment_anything import SamPredictor, sam_model_registry

from .segment import get_input_points_and_labes


def segment(img):
    """
    Performs segmentation using SAM local model

    requires file in './sam_segmentation/sam_vit_h_4b8939.pth'
    """
    dire = os.path.dirname(os.path.abspath(__file__))
    filename = 'sam_vit_h_4b8939.pth'
    model = sam_model_registry['vit_h'](
        checkpoint=os.path.join(dire, filename))
    predictor = SamPredictor(model)
    predictor.set_image(img)
    input_points, input_labels = get_input_points_and_labes(img)
    msks, scores, _ = predictor.predict(
        point_coords=np.array(input_points),
        point_labels=np.array(input_labels),
        multimask_output=True,
    )
    results = zip(msks, scores)
    results = sorted(results, key=(lambda item: item[1]), reverse=True)
    msk = results[0][0]
    segmentation = np.asarray(msk, dtype="uint8")
    segmentation *= 255
    return segmentation, results[0][1]
