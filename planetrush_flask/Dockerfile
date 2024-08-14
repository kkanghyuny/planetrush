# 베이스 이미지로 Python 3.11 사용
FROM python:3.11

# 작업 디렉토리 설정
WORKDIR /app

# PyTorch 및 관련 패키지 설치 (필요시 버전 고정)
RUN pip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2

# 애플리케이션의 Python 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# Gunicorn 설치
RUN pip install gunicorn

# Gunicorn을 사용하여 애플리케이션 실행
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:3000", "app:app"]
