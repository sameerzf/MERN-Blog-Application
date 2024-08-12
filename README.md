# MERN Blog Application

## Overview

The **MERN Blog Application** is a full-stack blog application built using the MERN stack (MongoDB, Express.js, React, Node.js). This application features user authentication and authorization with JWT (JSON Web Tokens) and secure password hashing using bcrypt. Users can register, log in, and manage blog posts with CRUD (Create, Read, Update, Delete) operations.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Full CRUD operations for blog posts
- Responsive and user-friendly interface

## Technologies Used

- **Frontend:**
  - React
  - Axios for HTTP requests
  - React Router for routing
  - Bootstrap or Material-UI for styling (optional)

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcrypt for password hashing

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (Node Package Manager)
- MongoDB (local or remote instance)

### Setting Up the Project

1. **Clone the repository:**

   ```bash
   git clone https://github.com/username/MERN-Blog-Application.git

   Navigate to the project directory:

bash
Copy code
cd MERN-Blog-Application
Install backend dependencies:

bash
Copy code
cd backend
npm install
Install frontend dependencies:

bash
Copy code
cd ../frontend
npm install
Configure Environment Variables:

Create a .env file in the backend directory with the following environment variables:

plaintext
Copy code
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your_jwt_secret
PORT=5000
Adjust these values based on your local or production environment setup.

Run the Application:

Start the backend server:

bash
Copy code
cd backend
npm start
Start the frontend development server:

bash
Copy code
cd ../frontend
npm start
The frontend application should be accessible at http://localhost:3000, and the backend server at http://localhost:5000.
