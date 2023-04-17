import pytest
import cv2
from ..testing import get_f1_score, get_mssism
from ..noise_removal import hair_removal, lession_segmentation
from ..image import ImageMetadata, TEST_IMAGES


@pytest.mark.parametrize('image_metadata', TEST_IMAGES)
def test_image_modification_in_hair_removal(image_metadata: ImageMetadata):
    approved_percentage = 0.2
    approved_percentage = 0.2

    img_org = cv2.imread(image_metadata.get_path(), cv2.IMREAD_COLOR)
    img_org = cv2.resize(img_org, (image_metadata.size, image_metadata.size))
    img = hair_removal(img_org)

    mssimv = get_mssism(img_org, img)
    average = 0
    average = 0
    for i in range(3):
        average += mssimv[i]
    assert average / 3 >= approved_percentage
        average += mssimv[i]
    assert average / 3 >= approved_percentage


@pytest.mark.parametrize('image_metadata', TEST_IMAGES)
def test_image_segmentation_precision(image_metadata: ImageMetadata):
    approved_percentage = 0.3
    approved_percentage = 0.3

    if not image_metadata.has_segmented_image:
        return

    img = cv2.imread(image_metadata.get_path(), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (image_metadata.size, image_metadata.size))
    img = hair_removal(img)
    img = lession_segmentation(img)

    img_org = cv2.imread(image_metadata.get_path(True), cv2.IMREAD_GRAYSCALE)
    img_org = cv2.resize(img_org, (image_metadata.size, image_metadata.size))

    f1_score = get_f1_score(img_org, img)

    assert f1_score >= approved_percentage
