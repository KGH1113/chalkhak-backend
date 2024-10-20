import { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  User,
  insertUser,
  updateUser,
  findUserByUserId,
  findUserByUsername,
  findUserByEmail,
} from "../models/userModel";
import { getJwtSecret } from "../config/jwtSecret";
import {
  createFollow,
  delteFollow,
  findFollowers,
  findFollowings,
} from "../models/followModel";

const JWT_SECRET = getJwtSecret();

// Register a new user
export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password, isPrivate } = req.body;
  try {
    const hashedPassword = await hash(password, 10);
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

// Login user and issue JWT
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

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: !user.fullName ? "" : user.fullName,
        profilePictureUrl: !user.profilePictureUrl
          ? ""
          : user.profilePictureUrl,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
}

// Update user details
export async function editUser(req: Request, res: Response): Promise<void> {
  const {
    username,
    email,
    password,
    fullName,
    bio,
    profilePictureUrl,
    isPrivate,
  } = req.body;
  const userId = req.user.userId;

  try {
    const hashedPassword = await hash(password, 10);
    await updateUser(userId, {
      username,
      email,
      password: hashedPassword,
      fullName,
      bio,
      profilePictureUrl,
      isPrivate,
    });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating user" });
  }
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

export async function followUser(req: Request, res: Response): Promise<void> {
  const { followedId } = req.body;
  try {
    await createFollow({ followerId: req.user.userId, followedId });
    res.status(200).json({ message: "User followed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error following user" });
  }
}

export async function unFollowUser(req: Request, res: Response): Promise<void> {
  const { followedId } = req.body;
  try {
    await delteFollow({ followerId: req.user.userId, followedId });
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error unfollowing user" });
  }
}

export async function getFollowers(req: Request, res: Response): Promise<void> {
  try {
    const followers = await findFollowers(req.user.userId);
    res.status(200).json(followers);
  } catch (err) {
    res.status(500).json({ error: "Error getting followers" });
  }
}

export async function getFollowings(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const followings = await findFollowings(req.user.userId);
    res.status(200).json(followings);
  } catch (err) {
    res.status(500).json({ error: "Error getting followers" });
  }
}

export async function getUser(req: Request, res: Response) {
  const { userId } = req.body;
  try {
    const user = await findUserByUserId(userId);
    if (!user?.isPrivate) {
      res.status(200).json(user);
      return;
    }
    const targetUserFollowers = await findFollowers(userId);
    const requestedUserFollowers = await findFollowers(req.user.userId);
    if (
      targetUserFollowers?.includes(req.user.userId) &&
      requestedUserFollowers?.includes(userId)
    ) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: "Account is private" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error getting user" });
  }
}
