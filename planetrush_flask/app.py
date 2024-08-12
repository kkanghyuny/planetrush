import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from sqlalchemy import and_
import enum
from mecab import MeCab  # MeCab 사용
from collections import Counter
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
from torchvision.models import EfficientNet_B0_Weights
from PIL import Image
import requests
from io import BytesIO
from sklearn.metrics.pairwise import cosine_similarity
import logging
from dotenv import load_dotenv

load_dotenv(verbose=True)
app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# -- 인기 키워드 --
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


class PopularKeyword(db.Model):
    __tablename__ = 'popular_keyword'  # 테이블 이름 설정

    # 컬럼 정의
    keyword_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)  # 자동 증가 기본 키
    keyword = db.Column(db.String(20), nullable=False)  # NOT NULL
    category = db.Column(db.String(20), nullable=False)  # NOT NULL
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # 기본값은 현재 시간


# 테이블 데이터 삭제
def delete_all_records(model):
    try:
        db.session.query(model).delete()
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting records: {str(e)}")
        return False


# 의미없는 단어 제거
def remove_stop_words(words):
    stop_words = set("매일 하루 일 분 시간 초 번 하나 운동 챌린지".split())
    return [word for word in words if word not in stop_words]


def get_mode_keywords(texts):
    nouns = []  # 명사만 저장
    mecab = MeCab()
    for text in texts:
        nouns += list(set(mecab.nouns(text)))
    clean_nouns = remove_stop_words(nouns)
    word_counts = Counter(clean_nouns)  # 단어 빈도 계산
    mode_keyword = [item[0] for item in word_counts.most_common(7)]  # 최빈값 추출, 상위 7개
    return mode_keyword


def add_keyword(mode_keywords, category):
    try:
        # `mode_keywords의 각 항목 객체 생성
        for keyword in mode_keywords:
            new_keyword = PopularKeyword(keyword=keyword, category=category)
            db.session.add(new_keyword)
        db.session.commit()
        return True

    except Exception as e:
        # 예외 발생 시 롤백
        db.session.rollback()
        app.logger.error(f"Error adding keyword: {str(e)}")
        return False


@app.route('/api/v1/admin/keyword', methods=['GET'])
def get_challenge_content():
    if delete_all_records(PopularKeyword):
        app.logger.info("All keyword records have been deleted successfully")
        for category in CategoryEnum:
            planets = Planet.query.filter(
                and_(
                    Planet.category == category.name,
                    Planet.created_at >= datetime.utcnow() - timedelta(days=7)  # 일주일 전 ~ 현재
                )
            ).all()
            if planets:
                challenge_contents = [planet.challenge_content for planet in planets]
                mode_keyword = get_mode_keywords(challenge_contents)
                if add_keyword(mode_keyword, category.name):
                    app.logger.info(f"Keywords added for category: {category.name}")
                else:
                    return jsonify({'message': 'There was an issue adding the keyword'}), 500
            else:
                app.logger.info(f"No planets found for category: {category.name}")
        return jsonify({'message': 'Keywords for all categories have been created successfully'}), 201
    else:
        return jsonify({"error": "An error occurred while deleting records"}), 500


# -- 이미지 유사도 --
# 모델 생성
def create_feature_extractor():
    base_model = models.efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)
    # 마지막 분류 레이어 제거하여 feature extractor로 사용
    feature_extractor = nn.Sequential(*list(base_model.children())[:-2])
    feature_extractor.eval()  # 평가 모드로 전환
    return feature_extractor


# 이미지 로드 및 전처리 함수
def load_and_preprocess_image_from_url(image_url, input_size=(224, 224)):
    try:
        response = requests.get(image_url, timeout=5)  # 네트워크 타임아웃 설정
        response.raise_for_status()  # HTTP 에러가 있는 경우 예외 발생
        image = Image.open(BytesIO(response.content)).convert('RGB')

        transform = transforms.Compose([
            transforms.Resize(input_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        image = transform(image).unsqueeze(0)  # 배치 차원 추가
        return image
    except Exception as e:
        app.logger.error(f"Error loading or processing image: {str(e)}")
        return None


# 두 이미지 비교 함수
def compare_images(image1_url, image2_url, feature_extractor, threshold):
    img1 = load_and_preprocess_image_from_url(image1_url)
    img2 = load_and_preprocess_image_from_url(image2_url)

    if img1 is None or img2 is None:
        return None

    with torch.no_grad():
        features1 = feature_extractor(img1).flatten().numpy()
        features2 = feature_extractor(img2).flatten().numpy()

    similarity = cosine_similarity([features1], [features2])[0][0]
    return round(similarity * 100), bool(similarity > threshold)


feature_extractor = create_feature_extractor()


@app.route('/api/v1/images', methods=['POST'])
def image_verification():
    standard_img_url = request.json.get('standardImgUrl')  # 기준 이미지
    target_img_url = request.json.get('targetImgUrl')  # 유저 이미지
    if not standard_img_url or not target_img_url:
        return jsonify({"error": "Both imgUrl1 and imgUrl2 are required"}), 400

    result = compare_images(standard_img_url, target_img_url, feature_extractor, threshold=0.088)

    if result is None:
        return jsonify({"error": "An error occurred while processing the images"}), 500

    return jsonify({
        "score": result[0],
        "verified": result[1]
    })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
