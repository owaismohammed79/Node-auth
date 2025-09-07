# Node.js & Express Authentication API

This is a comprehensive backend service for user authentication built with Node.js, Express, and MongoDB. It provides a secure and robust foundation for managing users, including local email/password registration, Google OAuth 2.0 integration, email verification, and a complete password reset workflow. The API is fully documented using Swagger.

## Features

-   **Local Authentication**: Secure user registration and login with password hashing (bcrypt).
-   **Social Login**: Seamless sign-up and sign-in with Google OAuth 2.0.
-   **JWT Sessions**: Stateless authentication using JSON Web Tokens stored in secure, HttpOnly cookies.
-   **Email Verification**: New users receive a verification link to activate their account.
-   **Password Reset**: A secure "forgot password" flow that sends a time-sensitive reset link via email.
-   **Protected Routes**: Middleware to protect specific endpoints, ensuring only authenticated users can access them.
-   **API Documentation**: Interactive API documentation available at `/api-docs`, powered by Swagger UI.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: Passport.js (for Google OAuth), JSON Web Token (JWT), bcryptjs
-   **Email**: Nodemailer (with Mailtrap for development)
-   **API Documentation**: Swagger JSDoc, Swagger UI Express
-   **Development**: Nodemon, dotenv

## Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v14 or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A running [MongoDB](https://www.mongodb.com/) instance (local or cloud-based like MongoDB Atlas)
-   A [Mailtrap](https://mailtrap.io/) account for testing email sending in development.
-   Google OAuth 2.0 Credentials from the [Google Cloud Console](https://console.cloud.google.com/).

## Getting Started

Follow these steps to get the project up and running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the sample file. Then, fill in the required values.
    ```bash
    cp .env.sample .env
    ```

4.  **Run the server:**
    The project uses `nodemon` to automatically restart the server on file changes.
    ```bash
    nodemon index.js
    ```
    The server will start on the port specified in your `.env` file (defaults to 4000).

## Environment Variables

You need to configure the following environment variables in your `.env` file:

| Variable                 | Description                                                              | Example                                              |
| ------------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| `MONGO_URL`              | Your MongoDB connection string.                                          | `mongodb://localhost:27017/auth-app`                 |
| `BACKEND_PORT`           | The port for the backend server.                                         | `4000`                                               |
| `BASE_URL`               | The base URL of your deployed backend.                                   | `http://localhost:4000`                              |
| `JWT_SECRET`             | A long, random, secret string for signing JWTs.                          | `your-super-secret-jwt-string`                       |
| `JWT_EXPIRE_TIME`        | Expiration time for JWTs (e.g., `1d`, `7h`).                             | `1d`                                                 |
| `MAILTRAP_HOST`          | Mailtrap SMTP host.                                                      | `smtp.mailtrap.io`                                   |
| `MAILTRAP_PORT`          | Mailtrap SMTP port.                                                      | `2525`                                               |
| `MAILTRAP_TEST_USER`     | Your Mailtrap username.                                                  | `your-mailtrap-user`                                 |
| `MAILTRAP_USER_PASSWORD` | Your Mailtrap password.                                                  | `your-mailtrap-password`                             |
| `GOOGLE_CLIENT_ID`       | Your Google OAuth Client ID.                                             | `your-id.apps.googleusercontent.com`                 |
| `GOOGLE_CLIENT_SECRET`   | Your Google OAuth Client Secret.                                         | `your-google-client-secret`                          |
| `FRONTEND_URL`           | The URL of your frontend application for redirects after social login.   | `http://localhost:3000`                              |

## API Documentation

Once the server is running, you can access the interactive API documentation by navigating to:
[`http://localhost:4000/api-docs`](http://localhost:4000/api-docs)
*(Replace the port if you've configured it differently).*

The documentation provides detailed information about each endpoint, including request bodies, parameters, and responses. For protected routes, you can authorize your requests by logging in and using the provided token in the Swagger UI's "Authorize" feature.
