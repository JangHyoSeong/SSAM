FROM openjdk:17-jdk
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENV JAVA_TOOL_OPTIONS -Djava.net.preferIPv4Stack=true
ENTRYPOINT ["java","-jar","app.jar"]