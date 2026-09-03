FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk AS runner
WORKDIR /app
COPY --from=builder ./app/target/saas-app-0.0.1-SNAPSHOT.jar ./app.jar
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar /opentelemetry-javaagent.jar
EXPOSE 8080
ENTRYPOINT ["java", \
  "-javaagent:/opentelemetry-javaagent.jar", \
  "-Dotel.exporter.otlp.endpoint=http://tempo:4318", \
  "-Dotel.exporter.otlp.protocol=http/protobuf", \
  "-Dotel.service.name=saas-back", \
  "-Dotel.metrics.exporter=none", \
  "-Dotel.logs.exporter=none", \
  "-jar", "app.jar"]