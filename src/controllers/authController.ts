import { Request, Response } from "express";
import {
  User,
  findUserByEmail,
  insertUser,
  findUserByUsername,
} from "../models/userModel";
import * as bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";
import {
  deleteRefreshToken,
  findRefreshToken,
  insertRefreshToken,
} from "../models/RefreshTokenModel";
import { JwtPayload } from "jsonwebtoken";

// Register a new user
export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password, isPrivate } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await insertUser({
      username,
      email,
      password: hashedPassword,
      isPrivate,
    });
    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    res.status(400).json({ error: "Error registering user" });
  }
}

// Login user
export async function login(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  try {
    let user: User | undefined;
    if (!username) {
      user = await findUserByEmail(email);
    } else {
      user = await findUserByUsername(username);
    }
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    await insertRefreshToken({
      userId: user.userId,
      token: refreshToken,
      expiresAt,
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error logging in" });
  }
}

// Refreshing the access token with refresh token
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { token } = req.body;

  // Checking validity of given refresh token
  const storedToken = await findRefreshToken({ token });
  if (!storedToken) {
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }
  const payload = verifyRefreshToken(token) as JwtPayload;
  if (!payload) {
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }

  // Generate new access token, refresh token
  const newAccessToken = generateAccessToken(payload.userId);
  const newRefreshToken = generateRefreshToken(payload.userId);

  // Delete the old token and storing the new one
  await deleteRefreshToken({ id: storedToken.id });
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  await insertRefreshToken({
    userId: payload.userId,
    token: newRefreshToken,
    expiresAt,
  });

  res
    .status(200)
    .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}

// Protected route (requires valid JWT)
export function protectedRoute(req: Request, res: Response): void {
  const user = req.user as User;
  res.json({
    message: `Welcome, user with userId "${user.userId}"! This is a protected route.`,
    user: {
      ...user,
    },
  });
}
