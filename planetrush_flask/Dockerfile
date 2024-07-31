# 베이스 이미지 설정
FROM python:3.9-slim

# 시스템 패키지 업데이트 및 libGL 설치
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx && \
    rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 요구 사항 파일 복사
COPY requirements.txt .

# Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 실행
CMD ["python", "app.py"]
