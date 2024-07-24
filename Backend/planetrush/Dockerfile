FROM openjdk:17-jdk

# JAR 파일 복사
COPY build/libs/*.jar app.jar

# docker run 시 실행할 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]