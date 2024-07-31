import os
from flask import Flask, jsonify, request
import cv2
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
from flask_sqlalchemy import SQLAlchemy
import enum
import numpy as np
from mecab import MeCab
from collections import Counter
from datetime import datetime
from dotenv import load_dotenv
load_dotenv(verbose=True)
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

# 이미지 유사도
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
            hists.append(hist.astype(np.float32))

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

    # 점수, 인증 결과 반환
    return jsonify({
        "similarity_score": score,
        "verified": verified
    })

# 인기 키워드 조회
# 의미없는 단어 제거
def remove_stop_words(words):
    stop_words = set("매일 하루 일 분 시간 초 번 하나 운동 챌린지".split())
    return [word for word in words if word not in stop_words]

def get_mode_keywords(texts):
    # 명사만 남기기
    nouns = []
    mecab = MeCab()
    for text in texts:
        nouns+=list(set(mecab.nouns(text)))


    clean_nouns = remove_stop_words(nouns)

    # 단어 빈도 계산
    word_counts = Counter(clean_nouns)
    # 최빈값 추출
    mode_keyword = [item[0] for item in word_counts.most_common(7)]
    return mode_keyword


# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Enum 정의
class CategoryEnum(enum.Enum):
    BEAUTY = 'BEAUTY'
    ETC = 'ETC'
    EXERCISE = 'EXERCISE'
    LIFE = 'LIFE'
    STUDY = 'STUDY'

class PlanetStatusEnum(enum.Enum):
    COMPLETED = 'COMPLETED'
    DESTROYED = 'DESTROYED'
    IN_PROGRESS = 'IN_PROGRESS'
    READY = 'READY'

# 모델 정의
class Planet(db.Model):
    __tablename__ = 'planet'
    planet_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)
    challenge_content = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(6), nullable=False, default=datetime.utcnow)
    current_participants = db.Column(db.Integer, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    max_participants = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(10), nullable=False)
    planet_img_url = db.Column(db.String(300), nullable=True)
    standard_verification_img = db.Column(db.String(300), nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    planet_status = db.Column(db.Enum(PlanetStatusEnum), nullable=False)
    verification_cond = db.Column(db.String(255), nullable=False)


class Keyword(db.Model):
    __tablename__ = 'keyword'  # 테이블 이름 설정

    # 컬럼 정의
    keyword_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)  # 자동 증가 기본 키
    keyword_name = db.Column(db.String(20), nullable=False)  # NOT NULL
    category = db.Column(db.String(20), nullable=False)  # NOT NULL
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # 기본값은 현재 시간

def add_keyword(mode_keywords, category):
    try:
        # `mode_keywords의 각 항목에 객체 생성
        for keyword in mode_keywords:
            new_keyword = Keyword(keyword_name=keyword, category=category)
            db.session.add(new_keyword)
        db.session.commit()

        return jsonify({'message': 'Keywords created successfully'}), 201
    except Exception as e:
        # 예외 발생 시 롤백
        db.session.rollback()
        return jsonify({'message': 'There was an issue creating keywords'}), 500

@app.route('/api/v1/admin/keyword', methods=['GET'])
def get_challenge_content():
    category = request.args.get('category')

    if not category or category not in CategoryEnum.__members__:
        return jsonify({'error': 'Invalid or missing category'}), 400

    planets = Planet.query.filter_by(category=category).all()

    if planets:
        challenge_contents = [planet.challenge_content for planet in planets]
        mode_keyword = get_mode_keywords(challenge_contents)
        # add_keyword를 호출하고 예외를 처리
        try:
            result = add_keyword(mode_keyword, category)
            return result  # add_keyword가 반환하는 응답을 직접 반환
        except Exception as e:
            return jsonify({'message': 'There was an issue adding the keyword'}), 500
    else:
        return jsonify({'message': 'No planets found for this category'}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
