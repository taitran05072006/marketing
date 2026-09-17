# Stage 1: Build source code bằng Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và tải dependencies trước để tận dụng cache
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy toàn bộ mã nguồn và build jar (bỏ qua test để build nhanh)
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime image gọn nhẹ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy file jar vừa build từ stage 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]