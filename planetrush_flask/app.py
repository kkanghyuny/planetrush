from flask import Flask, jsonify, request
import cv2
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
from flask_sqlalchemy import SQLAlchemy
import enum

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

# 인기 키워드 조회
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess
import numpy as np
from konlpy.tag import Okt
from collections import Counter


# 문장 벡터화 함수
def get_sentence_vector(sentence, model):
    words = simple_preprocess(sentence)
    word_vectors = [model.wv[word] for word in words if word in model.wv]
    if not word_vectors:
        return np.zeros(model.vector_size)
    return np.mean(word_vectors, axis=0)


# 단어 중요도 계산 함수
def get_word_importance(sentence, model):
    words = simple_preprocess(sentence)
    word_vectors = [model.wv[word] for word in words if word in model.wv]
    if not word_vectors:
        return {}
    sentence_vector = np.mean(word_vectors, axis=0)
    word_importance = {}
    for word in words:
        if word in model.wv:
            word_vector = model.wv[word]
            similarity = np.dot(sentence_vector, word_vector) / (
                        np.linalg.norm(sentence_vector) * np.linalg.norm(word_vector))
            word_importance[word] = similarity
    return word_importance


def get_mode_keyword(texts):
    # 문장을 토큰화
    tokenized_texts = [simple_preprocess(text) for text in texts]

    # Word2Vec 모델 학습
    model = Word2Vec(sentences=tokenized_texts, vector_size=50, window=5, min_count=1, workers=4)

    # 불용어
    stop_words = "매일 하루 분 시간 초 번 하나 운동 챌린지"
    stop_words = set(stop_words.split(' '))

    # 각 문장에서 상위 N개의 키워드 추출
    okt = Okt()

    top_n = 5
    keyword = []
    for i, text in enumerate(texts):
        importance = get_word_importance(text, model)
        sorted_words = sorted(importance.items(), key=lambda x: x[1], reverse=True)

        for word, score in sorted_words[:top_n]:
            word_pos = okt.pos(word)
            is_nouns = 0
            for w, pos in word_pos:
                if w in stop_words: # 불용어 제거
                    continue
                if pos != "Noun":
                    is_nouns = 0
                elif is_nouns == 1:
                    keyword[-1] += w
                else:  # Noun=true, is_nouns=0
                    is_nouns = 1
                    keyword.append(w)

    # 단어 빈도 계산
    word_counts = Counter(keyword)

    # 최빈값 추출
    mode_keyword = [item[0] for item in word_counts.most_common(6)]
    return mode_keyword


# 데이터베이스 설정
# env로 빼기
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://planetrush-test-user:plt1234@han-rds.cjnh2jkizbrs.ap-northeast-2.rds.amazonaws.com:3306/planetrush'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Enum 정의 (필요한 경우)
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
    current_participants = db.Column(db.Integer, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    max_participants = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime(6), nullable=False)
    custom_planet_img_id = db.Column(db.BigInteger, nullable=True)
    default_img_id = db.Column(db.BigInteger, nullable=False)
    standard_verification_img_id = db.Column(db.BigInteger, nullable=False)
    name = db.Column(db.String(10), nullable=False)
    challenge_content = db.Column(db.String(255), nullable=False)
    verification_cond = db.Column(db.String(255), nullable=False)
    category = db.Column(db.Enum(CategoryEnum), nullable=False)
    planet_status = db.Column(db.Enum(PlanetStatusEnum), nullable=False)


@app.route('/api/v1/admin/keyword', methods=['GET'])
def get_challenge_content():
    category = request.args.get('category')

    if not category or category not in CategoryEnum.__members__:
        return jsonify({'error': 'Invalid or missing category'}), 400

    planets = Planet.query.filter_by(category=category).all()

    if planets:
        challenge_contents = [planet.challenge_content for planet in planets]
        mode_keyword = get_mode_keyword(challenge_contents)
        return jsonify({'mode_keyword': mode_keyword})
    else:
        return jsonify({'message': 'No planets found for this category'}), 404


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)
