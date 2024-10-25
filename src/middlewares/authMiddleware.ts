import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getAccessTokenSecret } from "../config/jwtSecret";

const accessTokenSecret = getAccessTokenSecret();

// Middleware to verify JWT
export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access denied, token missing" });
    return;
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.user = user as typeof req.user;
    next();
  });
}
