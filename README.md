# MyDonations App


## Description
The MyDonations app is a simple template designed for creating single-page donation platforms. It integrates Jakarta EE, React, and MySQL with essential APIs like Stripe for secure payment processing. This application is set up with a fictional charity campaign as a placeholder, which users are encouraged to customize to support their specific causes. Ideal for developers looking to deploy a robust donations system quickly, and provides a solid foundation with flexibility for customization.

### Features
- **Jakarta EE Backend:** Uses Jakarta EE for backend development, focusing on security, scalability, and compliance with Java EE web standards.
- **Single-Page Application:** Built with React for a seamless user experience.
- **Secure API Integration:** Utilizes Stripe for secure transaction processing and ExchangeRate API for real-time currency conversion.
- **Customizable:** Designed to be easily adapted for different charity campaigns.
- **Docker Integration:** Containerized setup for easy deployment and scaling.
- **Kubernetes Ready:** Configured to also run on Kubernetes for larger-scale operations.


## Prerequisites
Before you can run or modify the MyDonations app, you will need to set up the following tools and accounts:

- **Development Tools and Languages**:
  - **JDK-17 & Jakarta EE:** Pre-configured in the provided Dockerfile (`mydonations/backend/Dockerfile`).
  - **React & npm:** Setup available in Dockerfile (`mydonations/frontend/Dockerfile`).
  - **MySQL Server 8.0.33**: Ensure compatibility with the backend configuration.
- **Accounts and API Keys**:
  - **Stripe Account:** For processing transactions ([Register here](https://dashboard.stripe.com/register)).
  - **ExchangeRate API Account:** For currency conversion rates ([Sign up here](https://app.exchangerate-api.com/sign-up)).
  - **Email SMTP Setup**: For sending emails from the application. While the configuration provided uses Gmail, you are free to use any SMTP server that suits your needs. For Gmail:
    - **Gmail App Password:** Required for SMTP email functionality with Gmail. Create your app-specific password [here](https://myaccount.google.com/apppasswords).
- **Containerization and Orchestration**:
  - **Docker Desktop:** For managing and running containerized applications.
  - **Kubernetes:** Optional, for orchestrating containers if deploying at scale (can be enabled in Docker Desktop or by installing Minikube for local testing).
- **Local Testing:** To test the application locally, you may want to install Docker Desktop with Kubernetes enabled, or set up Minikube. This is not mandatory but recommended for a full-featured deployment.


## Configuration and Setup
This project can be set up using Docker or Kubernetes, depending on your deployment needs. Below are the step-by-step guides for both environments:

### Initial Setup
1. **Prepare Your Environment**:
   - Clone the repository: `git clone https://github.com/colinchia/mydonations.git`.
   - Navigate to the cloned directory: `cd mydonations`.

2. **Install Docker Desktop**:
   - Download and install Docker Desktop from [Docker Hub](https://www.docker.com/products/docker-desktop).
   - Ensure Docker is running.

3. **Configure Project Settings**:
   - `mydonations/.env`: Configures environment variables, including database, mail settings, and API keys. Update `FRONTEND_URL` for production environments.
   - `mydonations/docker-compose.yaml`: Orchestrates MySQL, backend, and frontend services, utilizing environment variables from `mydonations/.env`. Ensures backend starts after MySQL is ready.
   - `mydonations/backend/Dockerfile`: Builds the Jakarta EE backend app and deploys it within a WildFly server environment.
   - `mydonations/backend/setup-ds.cli`: Scripts the MySQL datasource and driver on the Docker image's WildFly server. Update `user-name` and `password` to match your database credentials.
   - `mydonations/backend/standalone.xml`: Configures the WildFly server for the MyDonations app. Update the database credentials in the datasource section and check the MySQL driver settings:
      ```xml
      <datasource jndi-name="java:jboss/datasources/MyDonationsDS" pool-name="MyDonationsPool" enabled="true" use-java-context="true">
          <connection-url>jdbc:mysql://mysql:3306/mydonations</connection-url>
          <driver>mysql</driver>
          <security user-name="your_db_username" password="your_db_password"/>
      </datasource>
      <driver name="mysql" module="com.mysql">
          <xa-datasource-class>com.mysql.cj.jdbc.MysqlXADataSource</xa-datasource-class>
      </driver>
      ```
   - `mydonations/backend/src/main/resources/META-INF/microprofile-config.properties`: Manages environment variables for the backend application. Changes to variables should be made in the `mydonations/.env` or `mydonations/docker-compose.yaml` files to ensure consistency across your deployment setup.
   - `mydonations/backend/src/main/resources/META-INF/persistence.xml`: Configures the Jakarta Persistence settings for the application. Update `your_db_username` and `your_db_password` to match your database credentials.
   - `mydonations/frontend/Dockerfile`: Builds the React frontend application and serves it using Nginx.
   - `mydonations/frontend/.env`: Contains environment variables crucial for the React frontend, including API base URLs and public API keys. Ensure these values are correctly set before building the application, as they are embedded into the build.

### Docker Setup
4. **Build and Run the Application**:
   - From the project root directory, execute: `docker compose up --build`.
   - Access the application at `http://localhost:3000`.

### Kubernetes Setup
4. **Install Kubernetes Tooling**:
   - Install `kubectl` and Minikube following instructions on the [Kubernetes website](https://kubernetes.io/docs/tasks/tools/).
   - Start Minikube with `minikube start`.
   - Set Docker context to Minikube (if necessary) with `docker context use minikube`.

5. **Docker Hub Preparation**:
   - Create a Docker Hub account and repository for backend and frontend services.
   - Build and push Docker images:
     ```
     docker build -t <username>/mydonations-backend:v01 backend/
     docker build -t <username>/mydonations-frontend:v01 frontend/
     docker push <username>/mydonations-backend:v01
     docker push <username>/mydonations-frontend:v01
     ```

6. **Configure Kubernetes Secrets and Deployments**:
   - **Secrets Configuration**:
     Before applying Kubernetes configurations, manually create secrets to ensure they're securely encoded. Run the following commands in your terminal, replacing placeholder values with your actual sensitive data:
     ```bash
     kubectl create secret generic app-secrets \
       --from-literal MYSQL_ROOT_PASSWORD=rootpassword \
       --from-literal MYSQL_DATABASE=mydonations \
       --from-literal MYSQL_USER=your_db_username \
       --from-literal MYSQL_PASSWORD=your_db_password \
       --from-literal MAIL_USERNAME=your_email@gmail.com \
       --from-literal MAIL_PASSWORD=your_gmail_app_password \
       --from-literal STRIPE_SECRET_KEY=your_stripe_secret_key \
       --from-literal REACT_APP_KEY_EXCHANGERATEAPI=your_exchangerateapi_key \
       --from-literal REACT_APP_KEYPUBLIC_STRIPE=your_stripe_public_key
     ```

   - **Manifests Deployment**:
     Apply Kubernetes manifests in the specified order below, to ensure proper setup and dependency management. Avoid using a blanket command to apply all files at once, especially to prevent applying the `app-secrets.yaml` accidentally. Instead, apply each manifest individually as follows:
     ```bash
     kubectl apply -f mysql-configmap.yaml
     kubectl apply -f mysql-pvc.yaml
     kubectl apply -f mysql-service.yaml
     kubectl apply -f mysql-deployment.yaml
     # After confirming the MySQL pod is running:
     kubectl get all --all-namespaces
     
     kubectl apply -f backups-pvc.yaml
     kubectl apply -f backend-service.yaml
     kubectl apply -f backend-deployment.yaml
     # Confirm the backend pod is operational:
     kubectl get all --all-namespaces
     
     kubectl apply -f frontend-service.yaml
     kubectl apply -f frontend-deployment.yaml
     # Ensure the frontend pod is active before accessing the app:
     kubectl get all --all-namespaces
     ```

7. **Access Your Application**:
   - Run `minikube tunnel` for local testing.
   - Visit `http://localhost:3000` to view the application.


## Miscellaneous Notes
- **Customization of Payment Gateway:** The application's payment processing logic is built around Stripe. To use another provider, relevant changes are needed in the `DonationService.java` and payment component files.
- **Image Assets:** Place new images in `mydonations/frontend/public/img/`.
- **Automated Backups:** The application is configured to run automated backups nightly, saving transaction data in CSV format. These backups are stored in the Docker container at `/opt/mydonations/backups` and are mapped to a host directory via the Docker Compose configuration. Additionally, modify `BackupUtil.java` if you need to change the backup schedule or format.

Feel free to reach out or contribute to this project if you have suggestions or improvements!
