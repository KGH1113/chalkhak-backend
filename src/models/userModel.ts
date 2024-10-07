import db from "../config/db";
import { randomUUID } from "crypto";

export interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  fullName?: string;
  bio?: string;
  profilePictureUrl?: string;
  isPrivate: boolean;
}

// Create the users table
export function createUserTable(): void {
  const sql = `
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
  `;
  db.run(sql);
}

// Insert a new user
export function insertUser({
  username,
  email,
  password,
  isPrivate,
}: {
  username: string;
  email: string;
  password: string;
  isPrivate: boolean;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const uuid = `user:${randomUUID()}`;
    const sql = `INSERT INTO users (userId, username, email, password, isPrivate) VALUES (?, ?, ?, ?, ?)`;
    const params = [uuid, username, email, password, Number(isPrivate)];
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uuid);
      }
    });
  });
}

// Update user details
export function updateUser(
  userId: string,
  {
    username,
    email,
    password,
    fullName,
    bio,
    profilePictureUrl,
    isPrivate,
  }: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    bio: string;
    profilePictureUrl: string;
    isPrivate: boolean;
  }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users SET username = ?, email = ?, password = ?, fullName = ?, bio = ?, profilePictureUrl = ?, isPrivate = ? WHERE userId = ?
    `;
    const params = [
      username,
      email,
      password,
      fullName,
      bio,
      profilePictureUrl,
      Number(isPrivate),
      userId,
    ];

    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Find a user by username
export function findUserByUsername(
  username: string
): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as User);
      }
    });
  });
}

// Find a user by userId
export function findUserByUserId(userId: string): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE userId = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as User);
      }
    });
  });
}

// Find a user by email
export function findUserByEmail(email: string): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as User);
      }
    });
  });
}
