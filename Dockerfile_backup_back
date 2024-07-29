FROM openjdk:17-jdk
WORKDIR /app
COPY build/libs/Ssam-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENV JAVA_TOOL_OPTIONS -Djava.net.preferIPv4Stack=true
ENTRYPOINT ["java","-jar","app.jar"]
