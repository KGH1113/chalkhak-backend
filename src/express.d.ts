import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        username: string;
        email: string;
        fullName: string;
        profilePictureUrl: string;
      };
      file?: Multer.File;
    }
  }
}
