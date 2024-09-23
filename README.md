# Employee Management - Backend

This is the backend API for the **Employee Management System**, built using **Node.js**, **Express.js**, and **Prisma** as the ORM for **PostgreSQL**. The backend handles authentication, CRUD operations on employee data, server-side validations, and content delivery via **Cloudinary** for media files.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributors](#contributors)
- [License](#license)

## Features

- **Authentication**: JWT-based authentication for secure login.
- **Employee Management**: Create, Read, Update, and Delete (CRUD) operations on employee records.
- **Sorting & Filtering**: Server-side sorting and filtering of employees based on query parameters.
- **Validations**: Server-side validations for input data before processing.
- **Cloudinary Integration**: Store and manage employee profile pictures using Cloudinary CDN.

## Installation

### Prerequisites

- **Node.js** (v14.x or later)
- **PostgreSQL** (latest version)
- **Prisma** ORM
- **Cloudinary** account for CDN

### Steps to Run Locally

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/employee-management-backend.git
    cd employee-management-backend
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Setup Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```bash
    DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"
    CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
    JWT_SECRET="your_jwt_secret"
    ```

4. **Migrate the Database:**
    Apply migrations to set up the database schema using Prisma.
    ```bash
    npx prisma migrate dev
    ```

5. **Start the Server:**
    ```bash
    npm run dev
    ```

    The backend API will be available at `http://localhost:4000`.

## Usage

The backend provides RESTful API endpoints to manage employee data. The frontend interacts with these endpoints to perform operations such as creating, updating, and deleting employees.

To test the API directly:

1. Use an API client like **Postman** or **cURL**.
2. Use the following base URL for all API requests:
   ```bash
   http://localhost:4000/api
