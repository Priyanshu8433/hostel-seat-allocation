# Hostel Room Allocation System

This repository contains a Next.js frontend (`/client`) and an Express backend (`/server`) for a hostel room allocation system. The backend exposes REST endpoints for user authentication, student applications, and admin allocations, complaints and stats; the frontend includes the admin and student dashboard.

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

- `POST /complaints` – submit a complaint

  - Body (application/json):
    ```json
    { "student_id": 5, "description": "Light not working" }
    ```
  - Response: 201 created with `{ complaint }`.

- `GET /complaints/:student_id` – list complaints for a student

  - Example: `GET /complaints/5`
  - Response: 200 with `{ complaints: [...] }`.

- `PATCH /complaints/:id/status` – update complaint status

  - Example: `PATCH /complaints/13/status` with body `{ "status": "RESOLVED" }`
  - Response: 200 with the updated `{ complaint }`.

- `GET /admin/stats` and `GET /stats` – aggregated system statistics

  - Example: `GET /admin/stats` or `GET /stats`
  - Response (200):
    ```json
    {
      "statusCode": 200,
      "data": {
        "stats": {
          "total_students": 120,
          "open_complaints": 3,
          "pending_applications": 5,
          "total_beds": 200,
          "allocated_beds": 180,
          "available_beds": 20
        }
      },
      "message": "OK",
      "success": true
    }
    ```

- `GET /admin/stats/room/:room_id/students` and `GET /stats/room/:room_id/students` – list students allocated to a room

  - Example: `GET /admin/stats/room/3/students`
  - Response (200):

    ```json
    {
      "statusCode": 200,
      "data": {
        "students": [
          {
            "student_id": 12,
            "username": "alice",
            "email": "alice@example.com",
            "full_name": "Alice A.",
            "graduation_year": 2026,
            "allocation_id": 55,
            "room_id": 3,
            "allocated_at": "2025-11-01T12:00:00.000Z"
          }
        ]
      },
      "message": "OK",
      "success": true
    }
    ```

    - `GET /admin/stats/hostel/:hostel_id` and `GET /stats/hostel/:hostel_id` – per-hostel aggregated statistics (beds, allocations, students, complaints, optional warden)

      - Example: `GET /admin/stats/hostel/2`
      - Response (200):
        ```json
        {
          "statusCode": 200,
          "data": {
            "stats": {
              "hostel": {
                "id": 2,
                "name": "Hostel B",
                "warden_name": "Dummy Warden"
              },
              "total_beds": 50,
              "allocated_beds": 45,
              "available_beds": 5,
              "total_students": 45,
              "open_complaints": 2
            }
          },
          "message": "OK",
          "success": true
        }
        ```

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
    graduation_year INT NULL
  );
  ```

- Example `hostels` table:

  ```sql
  CREATE TABLE hostel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    warden_name VARCHAR(255) NULL
  );
  ```

- Example `rooms` table:

  ```sql
  CREATE TABLE rooms (
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
  Example `complaints` table:
  ```sql
  CREATE TABLE complaints (
      id INT NOT NULL AUTO_INCREMENT,
      student_id INT NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
  );
  ```
