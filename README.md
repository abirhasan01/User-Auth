# User Authentication Project

A clean and professional user authentication system using **Node.js**, **Express**, **MongoDB**, and **JWT**.

This repository provides a simple structure for implementing secure user registration, login, and protected routes.

---

## Project Structure

```
User-Auth/
├── client/       # Frontend (React or other framework)
└── server/       # Backend API (Node.js + Express)
```

---

## Features

* User Registration
* User Login
* Password Hashing (bcrypt)
* JWT Token Authentication
* Protected API Routes

---

## Prerequisites

* Node.js v14+
* MongoDB (local or Atlas)
* Git

---

## Installation

Clone the repository:

```bash
git clone https://github.com/abirhasan01/User-Auth.git
cd User-Auth
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm run dev    # or npm start
```

### Frontend Setup (Optional)

```bash
cd ../client
npm install
npm start
```

---

## API Endpoints (Example)

* `POST /api/auth/register` — Register a new user (body: name, email, password)
* `POST /api/auth/login` — Login user (body: email, password) → Returns JWT token
* `GET /api/user/me` — Protected route (Authorization: Bearer <token>)

---

## Testing

Use Postman, Insomnia, or frontend forms to test the APIs.

---

## Deployment Tips

* Set `NODE_ENV=production`
* Use MongoDB Atlas for production
* Keep `JWT_SECRET` strong and secure
* Frontend and backend can be deployed on platforms like Vercel, Render, or Heroku

---

## Contact

Linkedin: [abirhasan](https://www.linkedin.com/in/abirhasan0/)
