import db from "../config/db";

export interface Follow {
  followerId: string;
  followedId: string;
}

// Create follows table
export function createFollowsTable(): void {
  const sql = `
    CREATE TABLE IF NOT EXISTS follows (
      followerId TEXT REFERENCES users(userId),
      followedId TEXT REFERENCES users(userId),
      PRIMARY KEY(followerId, followedId)
    )
  `;
  db.run(sql);
}

// Create a new follow relationship (Following)
export function createFollow({
  followerId,
  followedId,
}: Follow): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO follows (followerId, followedId) VALUES (?, ?)
    `;
    const params = [followerId, followedId];
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Delete a exsisting follow relationship (Unfollowing)
export function delteFollow({ followerId, followedId }: Follow): Promise<void> {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM follows
      WHERE followerId = ?
      AND followedId = ?;
    `;
    const params = [followerId, followedId];
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Find followers by followedId
export function findFollowers(
  followedId: string
): Promise<string[] | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.userId
      FROM users u
      JOIN follows f ON u.userId = f.followerId
      WHERE f.followedId = ?;
    `;
    db.all(sql, [followedId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Map the rows to extract only the userId into a string array
        const userIds: string[] = (rows as { userId: string }[]).map(
          (row) => row.userId
        );
        resolve(userIds); // Resolve with the string array of userIds
      }
    });
  });
}

// Find followers by followerId
export function findFollowings(
  followerId: string
): Promise<string[] | undefined> {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.userId
      FROM users u
      JOIN follows f ON u.userId = f.followedId
      WHERE f.followerId = ?;
    `;
    db.all(sql, [followerId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Map the rows to extract only the userId into a string array
        const userIds: string[] = (rows as { userId: string }[]).map(
          (row) => row.userId
        );
        resolve(userIds); // Resolve with the string array of userIds
      }
    });
  });
}
