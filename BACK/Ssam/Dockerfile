# 빌드 스테이지
FROM gradle:7.2-jdk17 AS build

# Gradle 캐시를 위한 디렉토리 설정
WORKDIR /app

# 종속성 파일만 먼저 복사하여 Gradle 캐시 활용
COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle settings.gradle ./
RUN ./gradlew --version

# 전체 소스 코드 복사
COPY . .

# 빌드 실행
RUN ./gradlew build --no-daemon

# 실행 스테이지
FROM openjdk:17-jdk-slim

# 애플리케이션 작업 디렉토리 설정
WORKDIR /app

# 빌드 스테이지에서 생성된 JAR 파일을 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 포트 노출
EXPOSE 8081

# 애플리케이션 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
