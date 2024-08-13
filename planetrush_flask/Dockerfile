FROM python:3.11

WORKDIR /app

# 필요한 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# PyTorch 및 관련 패키지 설치 (CPU 버전)
RUN pip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2

# 나머지 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 나머지 파일을 복사
COPY . .

# 앱 실행
CMD ["python", "app.py"]
