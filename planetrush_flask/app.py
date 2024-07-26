from flask import Flask, jsonify, request
import cv2
import numpy as np
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

app = Flask(__name__)

# URL 이미지 로드
def load_image(url):
    try:
        resp = urlopen(url)
        arr = np.asarray(bytearray(resp.read()), dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except (URLError, HTTPError) as e:
        raise ValueError(f"Error loading image from URL: {url}, {e}")

@app.route('/api/v1/images', methods=['POST'])
def get_img_url():
    # 쿼리 매개변수
    standard_img_url = request.json.get('standardImgUrl') # 기준 이미지
    user_img_url = request.json.get('targetImgUrl') # 유저 이미지

    if not standard_img_url or not user_img_url:
        return jsonify({"error": "Both imgUrl1 and imgUrl2 are required"}), 400

    # OpenCV 이미지 유사도 검사
    img_urls = [standard_img_url, user_img_url]
    hists = []

    try:
        for url in img_urls:
            img = load_image(url)
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            hist = cv2.calcHist([hsv], [0, 1], None, [180, 256], [0, 180, 0, 256])
            cv2.normalize(hist, hist, 0, 1, cv2.NORM_MINMAX)
            hists.append(hist.astype(np.float32))  # float64 -> float32 변환

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    standard_img = hists[0]  # 기준 이미지
    flag = cv2.HISTCMP_INTERSECT  # 교차 검증

    try:
        score = cv2.compareHist(hists[0], hists[1], flag)
        if np.sum(standard_img) == 0:
            raise ZeroDivisionError("Sum of standard image histogram is zero.")
        score = round(score / np.sum(standard_img) * 100)
    except ZeroDivisionError as e:
        return jsonify({"error": str(e)}), 500

    verified = bool(score >= 35)  # boolean 값으로 변환

    # 0~100 점수, bool(true, false)
    return jsonify({
        "similarity_score": score,  # float32 -> float 변환
        "verified": verified  # bool 값을 JSON 직렬화
    })

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)
