import jwt from "jsonwebtoken";
import {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} from "../config/jwtSecret";

const accessTokenSecret = getAccessTokenSecret();
const refreshTokenSecret = getRefreshTokenSecret();
const accessTokenExpiry = "15m";
const refreshTokenExpiry = "7d";

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, accessTokenSecret);
  } catch (err) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (err) {
    return null;
  }
}
