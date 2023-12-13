# SAM segmentation

This module contains local segmentation using the .pth file and online segmentation using the azure ml endpoint.

## Local

To use local segmentation move sam_vit_h_4b8939.pth file to this folder and use the segment function in [./segment.py](./segment.py)

```python
# mask and score of segmentation
sam_msk, score = segment(img)
```

## Online

To use online segmentation file use the segment_online function in [./segment.py](./segment.py)

```python
# mask and score of segmentation
sam_msk, score = segment_online(img)
```


See [test_sam_segmentation.py](../image_processing/test_sam_segmentation.py) for a sample script and run it with:

```bash
pipenv run segment
```
