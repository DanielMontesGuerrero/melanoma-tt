import cv2
from skimage import img_as_float
from skimage.segmentation import chan_vese

def dull_razor(img):
    #Gray scale
    gray_scale = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY )

    #Black hat filter
    kernel = cv2.getStructuringElement(1, (9,9))
    blackhat = cv2.morphologyEx(gray_scale, cv2.MORPH_BLACKHAT, kernel)

    #Gaussian filter
    bhg = cv2.GaussianBlur(blackhat, (3,3), cv2.BORDER_DEFAULT)

    #Binary thresholding (MASK)
    _ret, mask = cv2.threshold(bhg, 10, 255, cv2.THRESH_BINARY)

    #Replace pixels of the mask
    dst = cv2.inpaint(img, mask, 6, cv2.INPAINT_TELEA)

    return dst, bhg

def median_filtering(img):
    return cv2.medianBlur(img, 5)

def otsu_method(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, ret = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return ret

def closing(img):
    img = invert_bitwise(img)
    return cv2.morphologyEx(img, cv2.MORPH_OPEN, (3,3))

def opening(img):
    img = invert_bitwise(img)
    return cv2.morphologyEx(img, cv2.MORPH_CLOSE, (3,3))

def invert_bitwise(img):
    return cv2.bitwise_not(img)

def and_bitwise(img, msk):
    return cv2.bitwise_and(img, img, mask = msk)

def chan_vese_segmentation(img):
    image = img_as_float(img)
    # Feel free to play around with the parameters to see how they impact the result
    cv = chan_vese(image, mu=0.95, lambda1=1, lambda2=2, tol=1e-3,
                   max_num_iter=200, dt=0.5, init_level_set="checkerboard",
                   extended_output=False)
    return img * cv

