
---

# Blog API Backend

This is a backend application for a blog platform. It provides RESTful API endpoints for managing users, posts, and comments. The application is built using Node.js, Express, and MongoDB.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)

## Features

- User authentication and authorization (signup, login, logout)
- CRUD operations for users, posts, and comments
- Role-based access control (admin and regular users)
- Secure password storage with bcrypt
- Token-based authentication using JWT

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- bcrypt
- JWT (JSON Web Token)
- express-validator

### Installation

1. Clone the repository:

   git clone https://github.com/Jfoti64/blog-api-backend
   cd blog-api-backend

2. Install the dependencies:

   npm install

3. Create a `.env` file in the root directory and add your MongoDB URI and JWT secret:

   MONGODB_URI=mongodb://localhost:27017/blog-api
   JWT_SECRET=your_jwt_secret

4. Start the server:

   npm run serverstart

## Configuration

The application uses environment variables for configuration. You can set these variables in a `.env` file in the root directory. The following variables are used:

- `MONGODB_URI`: The URI for connecting to your MongoDB instance.
- `JWT_SECRET`: The secret key used for signing JWT tokens.

## API Endpoints

### Authentication

- **POST /auth/signup**
  - Create a new user (signup).
  - Request body: `{ first_name, family_name, user_name, password }`
  - Response: `{ token, user }`

- **POST /auth/login**
  - Authenticate a user (login).
  - Request body: `{ user_name, password }`
  - Response: `{ token, isAdmin, user }`

- **POST /auth/logout**
  - Log out a user.

- **GET /auth/me**
  - Get the current logged-in user.
  - Requires authentication.

### Users

- **GET /users/**
  - Get all users.
  - Requires admin access.

- **GET /users/:id**
  - Get a single user by ID.
  - Requires authentication.

- **PUT /users/:id**
  - Update a user by ID.
  - Requires admin access.

- **DELETE /users/:id**
  - Delete a user by ID.
  - Requires admin access.

### Posts

- **GET /posts/**
  - Get all posts.

- **POST /posts/**
  - Create a new post.
  - Requires admin access.

- **GET /posts/:id**
  - Get a single post by ID.

- **PUT /posts/:id**
  - Update a post by ID.
  - Requires admin access.

- **DELETE /posts/:id**
  - Delete a post by ID.
  - Requires admin access.

### Comments

- **GET /posts/:postId/comments**
  - Get all comments for a specific post.

- **POST /posts/:postId/comments**
  - Create a new comment for a specific post.
  - Requires authentication.

- **GET /posts/:postId/comments/:commentId**
  - Get a single comment by ID.
  - Requires authentication.

- **PUT /posts/:postId/comments/:commentId**
  - Update a comment by ID.
  - Requires admin access.

- **DELETE /posts/:postId/comments/:commentId**
  - Delete a comment by ID.
  - Requires admin access.

## Authentication and Authorization

The application uses JWT for authentication. Users need to include a valid JWT token in the `Authorization` header of their requests to access protected routes. Admin routes are further restricted and require the user to have admin privileges.


---