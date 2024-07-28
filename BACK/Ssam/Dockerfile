# 빌드 스테이지
FROM gradle:7.2-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build --no-daemon 

# 실행 스테이지
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","app.jar"]