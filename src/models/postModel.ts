import db from "../config/db";
import { randomUUID } from "crypto";

export interface Post {
  postId: string;
  userId: string;
  content: string;
  mediaUrl: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  hidden: boolean;
}

// Create the posts table
export function createPostTable(): void {
  const sql = `
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
  `;
  db.run(sql);
}

// Insert a new post
export function insertPost({
  userId,
  content,
  mediaUrl,
  latitude,
  longitude,
}: {
  userId: string;
  content: string;
  mediaUrl: string;
  latitude: number;
  longitude: number;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const uuid = `post:${randomUUID()}`;
    const sql = `
      INSERT INTO posts (postId, userId, content, mediaUrl, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [uuid, userId, content, mediaUrl, latitude, longitude];
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uuid);
      }
    });
  });
}

// Update post
export function updatePost(
  postId: string,
  {
    content,
    mediaUrl,
    latitude,
    longitude,
    hidden,
  }: {
    content: string;
    mediaUrl: string;
    latitude: number;
    longitude: number;
    hidden: boolean;
  }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE posts SET content = ?, mediaUrl = ?, latitude = ?, longitude = ?, hidden = ? WHERE postId = ?
    `;
    const params = [content, mediaUrl, latitude, longitude, hidden, postId];

    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Find a post by postId
export function findPostByPostId(postId: string): Promise<Post | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM posts WHERE postId = ?`;
    db.get(sql, [postId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as Post);
      }
    });
  });
}

// Find a posts only that is from followed user
export async function getPostsByFollowedUsers(
  userId: string,
  date?: string
): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    const dateQuery = !date
      ? "AND p.createdAt >= DATE('now', '-7 days')"
      : "AND DATE(p.createdAt) = DATE(?)";
    const sql = `
      SELECT p.*
      FROM posts p
      JOIN follows f ON p.userId = f.followedId
      WHERE f.followerId = ?
      AND p.hidden = 0
      ${dateQuery};
    `;
    const params = !date ? [userId] : [userId, date];
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Post[]);
      }
    });
  });
}

export async function getPostsByUserId(
  userId: string,
  date?: string
): Promise<Post[]> {
  return new Promise((resolve, reject) => {
    const dateQuery = !date
      ? "AND p.createdAt >= DATE('now', '-7 days')"
      : "AND DATE(p.createdAt) = DATE(?)";
    const sql = `
      SELECT p.*
      FROM posts p
      WHERE p.userId = ?
      ${dateQuery};
    `;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as Post[]);
      }
    });
  });
}
