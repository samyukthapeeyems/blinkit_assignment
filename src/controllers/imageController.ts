import { Request, Response } from "express";
import Image from "../models/Image";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { user, tags, description } = req.body;
    const imagePath = req.file?.path; // Multer stores the file in req.file

    // Save the image to MongoDB
    const newImage = await Image.create({
      user,
      tags,
      description,
      imagePath,
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
