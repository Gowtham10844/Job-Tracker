# JobTrack – RESTful API Documentation

JobTrack provides a secure, token-authenticated RESTful API built with Node.js and Express.js, providing comprehensive endpoints for user authentication, job application lifecycle management, recruitment pipeline analytics, interview scheduling, and user profile management.

---

## 🌐 Base URL & Configuration

| Environment | Base URL |
| :--- | :--- |
| **Local Development** | `http://localhost:5000/api` |
| **Production (Render)** | `https://jobtrack-backend.onrender.com/api` |

All requests and responses use the `application/json` MIME type unless otherwise noted.

---

## 🔒 Authentication & Headers

Protected endpoints require a JSON Web Token (JWT) sent in the HTTP `Authorization` request header:

```http
Authorization: Bearer <jwt_token_here>
Content-Type: application/json
```

When an unauthenticated request or expired token is sent to a protected endpoint, the server responds with HTTP `401 Unauthorized`:

```json
{
  "success": false,
  "message": "Not authorized, token validation failed or expired"
}
```

---

## 📑 Endpoints Overview

| Category | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/` | Public | Server health check and API overview |
| **Auth** | `POST` | `/api/auth/register` | Public | Register new user account |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| **Auth** | `GET` | `/api/auth/me` | Protected | Fetch current user session details |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Protected | Aggregate application counts, chart data & recent entries |
| **Applications** | `GET` | `/api/applications` | Protected | List user applications with search, filter, and sort |
| **Applications** | `POST` | `/api/applications` | Protected | Create a new job application record |
| **Applications** | `GET` | `/api/applications/:id` | Protected | Retrieve details of a specific application |
| **Applications** | `PUT` | `/api/applications/:id` | Protected | Update application details or hiring status |
| **Applications** | `DELETE`| `/api/applications/:id` | Protected | Permanently remove an application record |
| **Interviews** | `GET` | `/api/interviews` | Protected | List upcoming and past interview schedules |
| **Users** | `GET` | `/api/users/profile` | Protected | Get profile details |
| **Users** | `PUT` | `/api/users/profile` | Protected | Update profile metadata or password |

---

## 🔑 Authentication Endpoints

### 1. Register User
- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Description**: Registers a new user with hashed password storage using bcrypt.

#### Request Body:
```json
{
  "name": "Gowtham Saimpu",
  "email": "sayimpugowtham@gmail.com",
  "password": "password123",
  "targetRole": "Software Development Engineer",
  "institution": "B.Tech Computer Science & Engineering"
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Gowtham Saimpu",
    "email": "sayimpugowtham@gmail.com",
    "targetRole": "Software Development Engineer",
    "institution": "B.Tech Computer Science & Engineering",
    "createdAt": "2025-02-16T12:00:00.000Z"
  }
}
```

---

### 2. User Login
- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates user credentials and issues a signed JWT token valid for 30 days.

#### Request Body:
```json
{
  "email": "sayimpugowtham@gmail.com",
  "password": "password123"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Gowtham Saimpu",
    "email": "sayimpugowtham@gmail.com",
    "targetRole": "Software Development Engineer",
    "institution": "B.Tech Computer Science & Engineering"
  }
}
```

---

## 📊 Dashboard Statistics Endpoint

### 3. Get Dashboard Analytics
- **Route**: `GET /api/dashboard/stats`
- **Access**: Protected (`Bearer <token>`)
- **Description**: Computes real-time recruitment metrics from MongoDB for the authenticated user.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "stats": {
    "total": 6,
    "applied": 1,
    "onlineAssessment": 1,
    "interviews": 2,
    "offers": 1,
    "rejected": 1,
    "withdrawn": 0,
    "statusDistribution": [
      { "name": "Applied", "value": 1, "color": "#3B82F6" },
      { "name": "Online Assessment", "value": 1, "color": "#8B5CF6" },
      { "name": "Interview", "value": 2, "color": "#F59E0B" },
      { "name": "Offer Received", "value": 1, "color": "#10B981" },
      { "name": "Rejected", "value": 1, "color": "#EF4444" }
    ],
    "monthlyActivity": [
      { "month": "Sep", "applications": 0 },
      { "month": "Oct", "applications": 0 },
      { "month": "Nov", "applications": 0 },
      { "month": "Dec", "applications": 1 },
      { "month": "Jan", "applications": 3 },
      { "month": "Feb", "applications": 2 }
    ],
    "upcomingInterviews": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c001",
        "companyName": "Google",
        "jobRole": "Software Engineering Intern",
        "status": "Interview",
        "interviewDate": "2025-02-20T10:30:00.000Z"
      }
    ],
    "recentApplications": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c006",
        "companyName": "Uber",
        "jobRole": "Frontend Software Engineer",
        "status": "Applied",
        "applicationDate": "2025-02-15T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 💼 Applications Management Endpoints

### 4. List Applications
- **Route**: `GET /api/applications`
- **Access**: Protected
- **Query Parameters**:
  - `search` (string): Search filter matching `companyName`, `jobRole`, or `location` (case-insensitive regex).
  - `status` (string): Filter by status (`Applied`, `Online Assessment`, `Interview`, `Offer Received`, `Rejected`, `Withdrawn`).
  - `jobType` (string): Filter by type (`Internship`, `Full-time`, `Part-time`, `Contract`).
  - `workMode` (string): Filter by mode (`On-site`, `Remote`, `Hybrid`).
  - `sort` (string): Sort order (`newest`, `oldest`, `company_asc`, `company_desc`, `interview_soonest`).

#### Sample Request:
```http
GET /api/applications?search=Google&status=Interview&sort=newest
Authorization: Bearer <token>
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c001",
      "userId": "65f1a2b3c4d5e6f7a8b9c0d1",
      "companyName": "Google",
      "jobRole": "Software Engineering Intern",
      "jobType": "Internship",
      "location": "Bangalore, India",
      "workMode": "Hybrid",
      "applicationDate": "2025-02-10T00:00:00.000Z",
      "status": "Interview",
      "salary": "₹1,15,000 / month",
      "jobLink": "https://careers.google.com/jobs/results/12345",
      "notes": "Round 1 cleared. Preparing for Round 2 DSA.",
      "interviewDate": "2025-02-20T10:30:00.000Z",
      "createdAt": "2025-02-10T08:00:00.000Z",
      "updatedAt": "2025-02-12T14:30:00.000Z"
    }
  ]
}
```

---

### 5. Create Application
- **Route**: `POST /api/applications`
- **Access**: Protected

#### Request Body:
```json
{
  "companyName": "Atlassian",
  "jobRole": "Associate Software Engineer",
  "jobType": "Full-time",
  "location": "Bengaluru, India",
  "workMode": "Remote",
  "applicationDate": "2025-02-16",
  "status": "Applied",
  "salary": "₹22 LPA",
  "jobLink": "https://atlassian.com/careers/123",
  "notes": "Applied via referral link from college alumnus."
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Job application tracked successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c099",
    "userId": "65f1a2b3c4d5e6f7a8b9c0d1",
    "companyName": "Atlassian",
    "jobRole": "Associate Software Engineer",
    "status": "Applied",
    "createdAt": "2025-02-16T13:00:00.000Z"
  }
}
```

---

### 6. Update Application
- **Route**: `PUT /api/applications/:id`
- **Access**: Protected
- **Description**: Modifies existing application fields. Validates that the application belongs to the logged-in user.

#### Request Body:
```json
{
  "status": "Interview",
  "interviewDate": "2025-02-24T14:00:00.000Z",
  "notes": "Technical round with Lead Architect scheduled."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c099",
    "companyName": "Atlassian",
    "status": "Interview",
    "interviewDate": "2025-02-24T14:00:00.000Z"
  }
}
```

---

### 7. Delete Application
- **Route**: `DELETE /api/applications/:id`
- **Access**: Protected

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Job application deleted successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7a8b9c099"
  }
}
```

---

## 🗓️ Interview Scheduling Endpoints

### 8. Get All Scheduled Interviews
- **Route**: `GET /api/interviews`
- **Access**: Protected
- **Description**: Returns applications having a non-null `interviewDate`, partitioned into `upcoming` and `past`.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "totalInterviews": 3,
  "upcoming": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c001",
      "companyName": "Google",
      "jobRole": "Software Engineering Intern",
      "interviewDate": "2025-02-20T10:30:00.000Z",
      "status": "Interview"
    }
  ],
  "past": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c002",
      "companyName": "Microsoft",
      "jobRole": "SDE-1",
      "interviewDate": "2025-02-14T11:00:00.000Z",
      "status": "Offer Received"
    }
  ]
}
```

---

## 👤 User Profile Endpoints

### 9. Update Profile Information
- **Route**: `PUT /api/users/profile`
- **Access**: Protected

#### Request Body:
```json
{
  "name": "Gowtham Saimpu",
  "targetRole": "Full-Stack Software Engineer",
  "institution": "B.Tech Computer Science & Engineering",
  "currentPassword": "password123",
  "newPassword": "newsecurepassword456"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Gowtham Saimpu",
    "email": "sayimpugowtham@gmail.com",
    "targetRole": "Full-Stack Software Engineer",
    "institution": "B.Tech Computer Science & Engineering"
  }
}
```

---

## ⚠️ HTTP Status Codes Reference

| Code | Status | Description |
| :--- | :--- | :--- |
| `200` | **OK** | Request succeeded; returns data payload |
| `201` | **Created** | Resource created successfully (user or application) |
| `400` | **Bad Request** | Missing required parameters or failed validation |
| `401` | **Unauthorized** | Missing, invalid, or expired JWT bearer token |
| `404` | **Not Found** | Requested application ID or endpoint does not exist |
| `500` | **Internal Server Error** | Unexpected exception caught by central error middleware |
