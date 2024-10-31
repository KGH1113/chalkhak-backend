---

# 찰칵! (Chalkhak!) - A Location-Based Social Network

찰칵!(Chalkhak) is a social networking app that revolves around a map-based UI. Users can share their moments by uploading posts tied to specific geographic locations. Followers can view posts directly on the map, adding a unique geolocation context to the shared content. The backend is powered by Express, TypeScript, JWT for authentication, and multer for media uploads.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Post Endpoints](#post-endpoints)
- [Database Structure](#database-structure)
- [License](#license)

## Features

- **User Registration and Login**: Secure JWT-based authentication.
- **Map-based UI**: Posts are displayed at their geographic location on the map.
- **Post Creation**: Users can upload text posts and media (images/videos) tied to specific locations.
- **Follow System**: Users can follow and unfollow other users, with notifications appearing on their maps.
- **File Upload**: Multer is used for uploading media files, which are stored in the `/uploads` directory.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Database**: SQLite (for development)
- **Geolocation**: Integrated with map-based UI (details not included here)
  
## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/KGH1113/chalkhak-backend.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd chalkhak
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables**: Create a `.env` file in the root directory and add the following:

   ```bash
   PORT=3000
   ACCESS_TOKEN_SECRET=your_access_token_jwt_secret_key
   REFRESH_TOKEN_SECRET=refresh_token_jwt_secret_key
   ```

5. **Run the server**:

   ```bash
   npm run dev
   ```

6. The server will start on `http://localhost:3000`.

## Usage

- Once the server is running, you can interact with the backend API using a REST client like Postman or cURL.
- The base URL for all endpoints is: `http://localhost:3000/api`.

## API Endpoints

### Auth Endpoints

- **POST** `/api/auth/register`
  Register a new user
  **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "isPrivate": "boolean"
  }
  ```

- **POST** `/api/auth/login`  
  Log in an existing user. If either email or username is an empty string, the non-empty one is used for logging in.  
  **Body**:
  ```json
  {
    "username":"string"
    "email": "string",
    "password": "string"
  }
  ```

- **POST** `/api/auth/refresh-token`  
  Refreshing the access token using refresh token.  
  **Body**:
  ```json
  {
    "token":"string"
  }
  ```

- **GET** `/api/auth/protected`
  Protected route. Requires JWT.

### User Endpoints

- **PUT** `/api/users/edit`  
  Update user profile. Requires JWT.  
  **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "fullName": "string",
    "bio": "string",
    "profilePictureUrl": "string",
    "isPrivate": "boolean",
  }
  ```

- **POST** `/api/users/follow`  
  Following the user. Requires JWT.  
  **Body**:
  ```json
  {
    "followedId":"string"
  }
  ```

- **POST** `/api/users/unfollow`  
  Unfollowing the user. Requires JWT.  
  **Body**:
  ```json
  {
    "followedId":"string"
  }
  ```

- **POST** `/api/users/get`  
  Get a user data by userId. Requires JWT.  
  **Body**:
  ```json
  {
    "userId":"string"
  }
  ```

- **GET** `/api/users/followers`  
  Get a list of followers for the authenticated user. Requires JWT.

- **GET** `/api/users/followings`  
  Get a list of followings for the authenticated user. Requires JWT.

### Post Endpoints

- **POST** `/api/posts/upload`  
  Upload a new post. Requires JWT.  
  **Body**:
  ```json
  {
    "content": "string",
    "mediaUrl":"string",
    "latitude": "number",
    "longitude": "number"
  }
  ```

- **PUT** `/api/posts/edit`  
  Edit an existing post. Requires JWT.  
  **Body**:
  ```json
  {
    "postId": "string",
    "content": "string",
    "mediaUrl":"string",
    "latitude":"number",
    "longitude":"number"
  }
  ```

- **GET** `/api/posts/get`  
  Get a posts that is uploaded specific date. If there is nothing in query param, posts uploaded recent 7days will given. Requires JWT.  
  **Query Params**:
  - `date`: The date the post was uploaded

- **POST** `/api/posts/upload-media`  
  Upload media (image or video) to an existing post. Requires JWT.  
  **Form Data**:
  - `file`: Upload an image or video file (handled by multer middleware)

## Database Structure

The project uses SQLite for development purposes, and the database structure includes the following tables:

- **Users**: Stores user data including username, email, password, bio, etc.
- **Posts**: Contains post data, including the text content, location (latitude/longitude), and associated media files.
- **Follows**: Manages user follow relationships (who follows whom).
- **Refresh Tokens**: Manages refresh tokens.

### SQLite Schema

- `users`: 
  ```sql
  CREATE TABLE IF NOT EXISTS posts (
    postId TEXT PRIMARY KEY,
    userId TEXT REFERENCES users(userId),
    content TEXT NOT NULL,
    mediaUrl TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    createdAt TIMESTAMP DEFAULT (datetime('now','localtime')),
    hidden INTEAGER DEFAULT 0
  )
  ```
  
- `posts`: 
  ```sql
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT,
    createdAt TIMESTAMP DEFAULT (datetime('now','localtime')),
    fullName VARCHAR(100),
    bio TEXT,
    profilePictureUrl TEXT,
    isPrivate INTEAGER DEFAULT 0
  )
  ```
  
- `follows`: 
  ```sql
  CREATE TABLE IF NOT EXISTS follows (
    followerId TEXT REFERENCES users(userId),
    followedId TEXT REFERENCES users(userId),
    PRIMARY KEY(followerId, followedId)
  )
  ```

- `refreshTokens`:
  ```sql
  CREATE TABLE IF NOT EXISTS refreshTokens (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    token TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
  )
  ```

## License

All rights reserved. See the [LICENSE](LICENSE.txt) file for more details.

---
