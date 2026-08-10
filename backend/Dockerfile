# Multi-stage Dockerfile for Java Spring Boot Backend Service
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven POM and pre-fetch dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and build jar
COPY src ./src
RUN mvn clean package -DskipTests

# --- Production JRE Runtime Stage ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S atelier && adduser -S atelier -G atelier
USER atelier

EXPOSE 8080

# Environment variables with practice dummy defaults
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV ADMIN_EMAIL=hanamanttaranal19@gmail.com
ENV ADMIN_PASSWORD=12345
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_NAME=atelier_fashion_db
ENV DB_USER=atelier_admin
ENV DB_PASSWORD=atelier_dummy_secure_pass_123

# Copy artifact from build stage
COPY --from=build /app/target/*.jar app.jar

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
