import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from sqlalchemy import and_, case
from sqlalchemy import func
import enum
from mecab import MeCab
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
from scipy import stats
from apscheduler.schedulers.background import BackgroundScheduler
from waitress import serve

load_dotenv(verbose=True)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)

# 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


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


class ChallengeResultEnum(enum.Enum):
    FAIL = 'FAIL'
    SUCCESS = 'SUCCESS'


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
    __tablename__ = 'popular_keyword'
    keyword_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    keyword = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class ProgressAvg(db.Model):
    __tablename__ = 'progress_avg'
    progress_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    beauty_avg = db.Column(db.Float, nullable=True)
    etc_avg = db.Column(db.Float, nullable=True)
    exercise_avg = db.Column(db.Float, nullable=True)
    life_avg = db.Column(db.Float, nullable=True)
    study_avg = db.Column(db.Float, nullable=True)
    total_avg = db.Column(db.Float, nullable=True)
    member_id = db.Column(db.BigInteger, db.ForeignKey('member.member_id'), nullable=True)


class ChallengeHistory(db.Model):
    __tablename__ = 'challenge_history'
    challenge_history_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)
    challenge_content = db.Column(db.String(255), nullable=False)
    planet_img_url = db.Column(db.String(255), nullable=False)
    planet_name = db.Column(db.String(255), nullable=False)
    progress = db.Column(db.Float, nullable=False)
    member_id = db.Column(db.BigInteger, db.ForeignKey('member.member_id'), nullable=True)
    challenge_result = db.Column(db.Enum(ChallengeResultEnum), nullable=False)


# -- 인기 키워드 --
def delete_all_records(model):
    try:
        db.session.query(model).delete()
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting records: {str(e)}")
        return False


def remove_stop_words(words):
    stop_words = set("매일 하루 일 분 시간 초 번 하나 운동 챌린지".split())
    return [word for word in words if word not in stop_words]


def get_mode_keywords(texts):
    mecab = MeCab()
    nouns = []
    for text in texts:
        nouns += list(set(mecab.nouns(text)))
    clean_nouns = remove_stop_words(nouns)
    word_counts = Counter(clean_nouns)
    return [item[0] for item in word_counts.most_common(7)]


def add_keyword(mode_keywords, category):
    try:
        for keyword in mode_keywords:
            db.session.add(PopularKeyword(keyword=keyword, category=category))
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error adding keyword: {str(e)}")
        return False


def get_challenge_content():
    with app.app_context():  # current_app 대신 app을 직접 사용하여 애플리케이션 컨텍스트 설정
        if delete_all_records(PopularKeyword):
            for category in CategoryEnum:
                planets = Planet.query.filter(
                    and_(
                        Planet.category == category.name,
                        Planet.created_at >= datetime.utcnow() - timedelta(days=7)
                    )
                ).all()
                if planets:
                    challenge_contents = [planet.challenge_content for planet in planets]
                    mode_keyword = get_mode_keywords(challenge_contents)
                    if add_keyword(mode_keyword, category.name):
                        app.logger.info(f"Keywords added for category: {category.name}")
                    else:
                        app.logger.error("There was an issue adding the keyword")
                else:
                    app.logger.info(f"No planets found for category: {category.name}")
        else:
            app.logger.error("An error occurred while deleting records")


# 스케줄러
cron = BackgroundScheduler(daemon=True, timezone='Asia/Seoul')
cron.add_job(get_challenge_content, 'cron', day_of_week='sun', hour=0, minute=0)  # 매주 일요일 밤 12시(00:00)에 실행
# 스케줄러 시작
cron.start()


# -- 이미지 유사도 --
def create_feature_extractor():
    base_model = models.efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT)
    feature_extractor = nn.Sequential(*list(base_model.children())[:-2])
    feature_extractor.eval()
    return feature_extractor


def load_and_preprocess_image_from_url(image_url, input_size=(224, 224)):
    try:
        response = requests.get(image_url, timeout=5)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert('RGB')
        transform = transforms.Compose([
            transforms.Resize(input_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        return transform(image).unsqueeze(0)
    except Exception as e:
        app.logger.error(f"Error loading or processing image: {str(e)}")
        return None


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


@app.route('/ai/v1/images', methods=['POST'])
def image_verification():
    standard_img_url = request.json.get('standardImgUrl')
    target_img_url = request.json.get('targetImgUrl')
    if not standard_img_url or not target_img_url:
        return jsonify({"error": "Both imgUrl1 and imgUrl2 are required"}), 400

    result = compare_images(standard_img_url, target_img_url, feature_extractor, threshold=0.088)

    if result is None:
        return jsonify({"error": "An error occurred while processing the images"}), 500

    return jsonify({
        "score": result[0],
        "verified": result[1]
    })


# -- 마이페이지 --
def calculate_z_score_percentiles(category_stats, user_avg):
    percentiles = {}
    for category, stats_data in category_stats.items():
        mean = stats_data['avg']
        std_dev = stats_data['stddev']
        user_score = user_avg.get(category)
        if user_score != -1 and mean != -1 and std_dev != -1 and std_dev != 0:
            z_score = (user_score - mean) / std_dev
            percentiles[category] = (1 - stats.norm.cdf(z_score)) * 100
        else:
            percentiles[category] = -1  # 유효하지 않은 값 처리
    return percentiles


@app.route('/ai/v1/members/mypage/<int:member_id>', methods=['GET'])
def get_progress_avg(member_id):
    success_challenge_cnt = db.session.query(func.count(ChallengeHistory.challenge_history_id)).filter(
        ChallengeHistory.member_id == member_id,
        ChallengeHistory.challenge_result == ChallengeResultEnum.SUCCESS
        ).scalar()
    all_challenge_cnt = db.session.query(func.count(ChallengeHistory.challenge_history_id)).filter(
        ChallengeHistory.member_id == member_id,
        ).scalar()
    user_progress = ProgressAvg.query.filter_by(member_id=member_id).first()

    if not user_progress:
        response = {
            "code": "3001",
            "message": "해당 회원에 대한 평균 진행률 데이터가 없습니다.",
            "data": None,
            "isSuccess": False
        }
        return jsonify(response), 404

    # 각 카테고리별 평균과 표준편차를 구하는 쿼리에서 -1을 제외하고 계산
    stats_query = db.session.query(
        func.avg(case((ProgressAvg.beauty_avg != -1, ProgressAvg.beauty_avg), else_=None)).label('beauty_avg'),
        func.stddev(case((ProgressAvg.beauty_avg != -1, ProgressAvg.beauty_avg), else_=None)).label('beauty_stddev'),
        func.avg(case((ProgressAvg.etc_avg != -1, ProgressAvg.etc_avg), else_=None)).label('etc_avg'),
        func.stddev(case((ProgressAvg.etc_avg != -1, ProgressAvg.etc_avg), else_=None)).label('etc_stddev'),
        func.avg(case((ProgressAvg.exercise_avg != -1, ProgressAvg.exercise_avg), else_=None)).label('exercise_avg'),
        func.stddev(case((ProgressAvg.exercise_avg != -1, ProgressAvg.exercise_avg), else_=None)).label('exercise_stddev'),
        func.avg(case((ProgressAvg.life_avg != -1, ProgressAvg.life_avg), else_=None)).label('life_avg'),
        func.stddev(case((ProgressAvg.life_avg != -1, ProgressAvg.life_avg), else_=None)).label('life_stddev'),
        func.avg(case((ProgressAvg.study_avg != -1, ProgressAvg.study_avg), else_=None)).label('study_avg'),
        func.stddev(case((ProgressAvg.study_avg != -1, ProgressAvg.study_avg), else_=None)).label('study_stddev'),
        func.avg(case((ProgressAvg.total_avg != -1, ProgressAvg.total_avg), else_=None)).label('total_avg'),
        func.stddev(case((ProgressAvg.total_avg != -1, ProgressAvg.total_avg), else_=None)).label('total_stddev')
    ).one()

    # 결과를 딕셔너리 형태로 정리
    category_stats = {
        'beauty': {'avg': stats_query.beauty_avg if stats_query.beauty_avg is not None else -1,
                   'stddev': stats_query.beauty_stddev if stats_query.beauty_stddev is not None else -1},
        'etc': {'avg': stats_query.etc_avg if stats_query.etc_avg is not None else -1,
                'stddev': stats_query.etc_stddev if stats_query.etc_stddev is not None else -1},
        'exercise': {'avg': stats_query.exercise_avg if stats_query.exercise_avg is not None else -1,
                     'stddev': stats_query.exercise_stddev if stats_query.exercise_stddev is not None else -1},
        'life': {'avg': stats_query.life_avg if stats_query.life_avg is not None else -1,
                 'stddev': stats_query.life_stddev if stats_query.life_stddev is not None else -1},
        'study': {'avg': stats_query.study_avg if stats_query.study_avg is not None else -1,
                  'stddev': stats_query.study_stddev if stats_query.study_stddev is not None else -1},
        'total': {'avg': stats_query.total_avg if stats_query.total_avg is not None else -1,
                  'stddev': stats_query.total_stddev if stats_query.total_stddev is not None else -1},
    }

    # 특정 사용자의 점수 딕셔너리
    user_avg = {
        'beauty': user_progress.beauty_avg,
        'etc': user_progress.etc_avg,
        'exercise': user_progress.exercise_avg,
        'life': user_progress.life_avg,
        'study': user_progress.study_avg,
        'total': user_progress.total_avg
    }

    # 사용자의 백분위수 계산
    user_percentiles = calculate_z_score_percentiles(category_stats, user_avg)

    # 응답 데이터
    response_data = {
        "completionCnt": success_challenge_cnt,
        "challengeCnt": all_challenge_cnt,
        "myTotalAvg": user_avg['total'],
        "myTotalPer": user_percentiles['total'],
        "totalAvg": category_stats['total']['avg'],
        "myExerciseAvg": user_avg['exercise'],
        "myExercisePer": user_percentiles['exercise'],
        "exerciseAvg": category_stats['exercise']['avg'],
        "myBeautyAvg": user_avg['beauty'],
        "myBeautyPer": user_percentiles['beauty'],
        "beautyAvg": category_stats['beauty']['avg'],
        "myLifeAvg": user_avg['life'],
        "myLifePer": user_percentiles['life'],
        "lifeAvg": category_stats['life']['avg'],
        "myStudyAvg": user_avg['study'],
        "myStudyPer": user_percentiles['study'],
        "studyAvg": category_stats['study']['avg'],
        "myEtcAvg": user_avg['etc'],
        "myEtcPer": user_percentiles['etc'],
        "etcAvg": category_stats['etc']['avg']
    }

    rounded_response_data = {key: round(value, 2) for key, value in response_data.items()}

    response = {
        "code": "2000",
        "message": "성공",
        "data": rounded_response_data,
        "isSuccess": True
    }
    return jsonify(response)


if __name__ == '__main__':
    if os.getenv('FLASK_ENV') == 'development':
        app.run(host="0.0.0.0", port=5000, debug=True)
    else:
        serve(app, host="0.0.0.0", port=5000)
