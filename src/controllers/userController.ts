import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { User, updateUser, findUserByUserId } from "../models/userModel";
import {
  createFollow,
  delteFollow,
  findFollowers,
  findFollowings,
} from "../models/followModel";

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
    const hashedPassword = await bcrypt.hash(password, 10);
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
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (!user?.isPrivate) {
      const result = Object.entries(user)
        .filter(([key]) => key !== "password")
        .reduce((obj: any, [key, value]: any) => {
          obj[key] = value;
          return obj;
        }, {});
      res.status(200).json(result);
      return;
    }
    const targetUserFollowers = await findFollowers(userId);
    const requestedUserFollowers = await findFollowers(req.user.userId);
    if (
      targetUserFollowers?.includes(req.user.userId) &&
      requestedUserFollowers?.includes(userId)
    ) {
      const result = Object.entries(user)
        .filter(([key]) => key !== "password")
        .reduce((obj: any, [key, value]: any) => {
          obj[key] = value;
          return obj;
        }, {});
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: "Account is private" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error getting user" });
  }
}
