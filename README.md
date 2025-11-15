# Hostel Room Allocation System

This repository contains a Next.js frontend (`/client`) and an Express backend (`/server`) for a hostel room allocation system. The backend exposes REST endpoints for user authentication, student applications, and admin allocations; the frontend includes the admin and student dashboard.

## Contents

- `/client` – Next.js frontend
- `/server` – Express backend

## Tech stack

- Frontend: Next.js (React)
- Backend: Node.js + Express
- Database: MySQL (raw queries via `mysql2`)

## Quick start

1. Server

   - Install and run from the `server` folder:

     ```powershell
     cd server
     npm install
     npm run dev
     ```

   - The server listens on `PORT` (default 3000).

2. Client

   - Install and run from the `client` folder:

     ```powershell
     cd client
     npm install
     npm run dev
     ```

   - The Next.js app runs on port 3000 by default (change with `-p` or env).

## Environment variables (server/.env)

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` – MySQL connection
- `PORT` – server port (optional)
- `JWT_SECRET` – JSON Web Token secret

## Backend routes (HTTP API)

Base server mount points (from `server/src/index.js`):

- `POST /api/auth/register` – register a user

  - Body (application/json):
    ```json
    {
      "username": "jdoe",
      "email": "jdoe@example.com",
      "password": "secret",
      "full_name": "John Doe",
      "role": "STUDENT",
      "graduation_year": 2026
    }
    ```
  - Response: 201 created with `user` object.

- `POST /api/auth/login` – login

  - Body:
    ```json
    { "email": "jdoe@example.com", "password": "secret" }
    ```
  - Response: 200 OK with `{ token, user }`.

- `POST /student/apply` – submit a hostel application (student)

  - Body:
    ```json
    { "student_id": "username", "hostel_id": 1, "message": "..." }
    ```
  - Response: 201 created with `application` object.

- `GET /student/:student_id/applications` – list applications for a student

  - Example: `GET /student/123/applications`
  - Response: 200 with `{ applications: [...] }`.

- `POST /admin/allocate` – allocate a room using a student's application (admin)

  - Body:
    ```json
    { "application_id": 10, "room_id": 5 }
    ```
  - Behavior: creates an allocation record and updates the application status (e.g., APPROVED/ALLOCATED).
  - Response: 201 with `allocation` object.

- `GET /admin/allocations/:student_id` – list allocations for a student
  - Example: `GET /admin/allocations/123`
  - Response: 200 with `{ allocations: [...] }`.

## Notes: database tables

- Example `users` table:

  ```sql
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('STUDENT','ADMIN') NOT NULL DEFAULT 'STUDENT',
    graduation_year INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```

- Example `hostel` table:

  ```sql
  CREATE TABLE hostel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
  );
  ```

- Example `room` table:

  ```sql
  CREATE TABLE room (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hostel_id INT NOT NULL,
    room_number VARCHAR(64) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    UNIQUE KEY (hostel_id, room_number),
    FOREIGN KEY (hostel_id) REFERENCES hostel(id) ON DELETE CASCADE
  );
  ```

- Example `applications` table (needs `created_at` / `updated_at` columns):

  ```sql
  CREATE TABLE applications (
  	id INT AUTO_INCREMENT PRIMARY KEY,
  	student_id INT NOT NULL,
  	hostel_id INT,
  	message TEXT,
  	status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```

- Example `allocations` table:
  ```sql
  CREATE TABLE allocations (
  	id INT AUTO_INCREMENT PRIMARY KEY,
  	student_id INT NOT NULL,
  	room_id INT NOT NULL,
  	allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
