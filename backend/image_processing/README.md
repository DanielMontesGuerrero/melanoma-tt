# How to run the demo with SAM
- Install the dependencies using `pipenv install`
    - If for some reason the segment\_anything module wasn't installed, then
      run
      ```
      pipenv install -e git+https://github.com/facebookresearch/segment-anything.git#egg=segment_anything
      ```
- Download SAM from [here](https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth) and copy it under `/backend/image_processing/util`
- Execute the `main.py` script under `/backend/image_processing`
