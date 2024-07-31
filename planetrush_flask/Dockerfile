FROM python:3.9-slim

WORKDIR /app

COPY ./planetrush_flask /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "app.py"]