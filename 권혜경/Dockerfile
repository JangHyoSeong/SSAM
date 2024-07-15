
# 기본 이미지로 Python 3.9 사용
FROM python:3.9-slim

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 파일들을 컨테이너로 복사
COPY requirements.txt .
COPY app.py .

# 필요한 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 컨테이너 실행 시 실행할 명령어
CMD ["python", "app.py"]
