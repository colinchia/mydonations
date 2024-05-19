### Stage 1: Build Jakarta EE application
FROM openjdk:17-slim AS build
RUN apt-get update && apt-get install -y maven
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY . .
RUN mvn clean package -DskipTests

### Stage 2: Create WildFly environment
FROM quay.io/wildfly/wildfly:31.0.0.Final-jdk17
USER root
RUN /opt/jboss/wildfly/bin/add-user.sh admin Admin#70365 --silent
RUN mkdir -p /opt/jboss/wildfly/modules/system/layers/base/com/mysql/main
ADD https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.2.0/mysql-connector-j-8.2.0.jar /opt/jboss/wildfly/modules/system/layers/base/com/mysql/main/
COPY module.xml /opt/jboss/wildfly/modules/system/layers/base/com/mysql/main/
COPY standalone.xml /opt/jboss/wildfly/standalone/configuration/standalone.xml

# Set correct permissions and ownership
RUN chown -R jboss:jboss /opt/jboss/wildfly/modules/system/layers/base/com/mysql && \
    chmod 644 /opt/jboss/wildfly/modules/system/layers/base/com/mysql/main/mysql-connector-j-8.2.0.jar

USER jboss

### Stage 3: Deploy application
COPY --from=build /app/target/mydonations-1.0-SNAPSHOT.war /opt/jboss/wildfly/standalone/deployments/
EXPOSE 8080
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
