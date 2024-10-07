import { Request, Response } from "express";
import {
  Post,
  insertPost,
  updatePost,
  findPostByPostId,
  getPostsByFollowedUsers,
  getPostsByUserId,
} from "../models/postModel";
import { findUserByUserId } from "../models/userModel";
import { findFollowers } from "../models/followModel";

// Upload a new post
export async function uploadPost(req: Request, res: Response): Promise<void> {
  const { content, mediaUrl, latitude, longitude } = req.body;
  try {
    const postId = await insertPost({
      userId: req.user.userId,
      content,
      mediaUrl,
      latitude,
      longitude,
    });
    res.status(201).json({ message: "Post uploaded successfully", postId });
  } catch (err) {
    res.status(400).json({ error: "Error uploading post" });
  }
}

// Update a post
export async function editPost(req: Request, res: Response): Promise<void> {
  const { postId, content, mediaUrl, latitude, longitude, hidden } = req.body;
  try {
    const postToEdit = await findPostByPostId(postId);
    if (postToEdit?.userId !== req.user.userId) {
      res.status(403).json({ message: "Auth failed" });
      return;
    }
    await updatePost(postId, {
      content,
      mediaUrl,
      latitude,
      longitude,
      hidden,
    });
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Error updating post" });
  }
}

export async function getPost(req: Request, res: Response) {
  const date = req.query.date as string | undefined; // YYYY-MM-DD
  try {
    const posts: Post[] = !date
      ? await getPostsByFollowedUsers(req.user.userId)
      : await getPostsByFollowedUsers(req.user.userId, date);
    const postsFromFolloweds = await Promise.all(
      posts.map(async (post: Post) => {
        const poster = await findUserByUserId(post.userId);
        const isFollowedEachOther = (
          await findFollowers(req.user.userId)
        )?.includes(req.user.userId);
        if (!poster?.isPrivate || (poster.isPrivate && isFollowedEachOther)) {
          return { ...post };
        } else {
          return null;
        }
      })
    );
    const postsFromItself = await getPostsByUserId(req.user.userId);
    const result = [
      ...postsFromFolloweds.filter((post) => post !== null),
      ...postsFromItself,
    ];
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Error getting post" });
  }
}

export async function uploadFile(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  }

  // File uploaded successfully
  const filePath = `/uploads/${req.file!.filename}`;
  res.status(200).json({
    message: "File uploaded successfully.",
    filePath,
  });
}
