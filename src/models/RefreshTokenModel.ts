import { get } from "http";
import db from "../config/db";
import { randomUUID } from "crypto";

export interface RefreshTokens {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

// Create the refreshTokens table
export function createRefreshTokensTable(): void {
  const sql = `
    CREATE TABLE IF NOT EXISTS refreshTokens (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      token TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
    )
  `;
  db.run(sql);
}

// Insert a new refresh token
export function insertRefreshToken({
  userId,
  token,
  expiresAt,
}: {
  userId: string;
  token: string;
  expiresAt: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO refreshTokens (id, userId, token, expiresAt) VALUES (?, ?, ?, ?)`;
    const uuid = `refreshToken:${randomUUID()}`;
    const params = [uuid, userId, token, expiresAt];
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(uuid);
      }
    });
  });
}

// Find a refresh token by its value
export function findRefreshToken({
  token,
}: {
  token: string;
}): Promise<RefreshTokens | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM refreshTokens WHERE token = ?`;
    db.get(sql, [token], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as RefreshTokens | undefined);
      }
    });
  });
}

// Delete a refresh token by its value
export function deleteRefreshToken({ id }: { id: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM refreshTokens WHERE id = ?`;
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Delete all refresh tokens for a specific user
export function deleteRefreshTokensByUserId({
  userId,
}: {
  userId: number;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM refreshTokens WHERE userId = ?`;
    db.run(sql, [userId], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
