ROM gradle:8.2-jdk17 AS build
WORKDIR /app
COPY build.gradle .
COPY settings.gradle .
COPY src ./src
RUN gradle build --no-daemon

FROM openjdk:17-jdk
WORKDIR /app
COPY --from=build /app/build/libs/Ssam-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENV JAVA_TOOL_OPTIONS -Djava.net.preferIPv4Stack=true
ENTRYPOINT ["java","-jar","app.jar"]
