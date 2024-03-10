import { Request, Response } from "express";
import Image from "../models/Image";
import fs from 'fs';
import User from "../models/User";


export const getAllImages = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const images = await Image.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(images);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { tags, description } = req.body;
    const imagePath = req.file?.filename;

    const newImage = new Image({
      user: req.user._id,
      imagePath: imagePath,
      description: description,
      tags: tags ? tags.split(',') : [],
    });

    await newImage.save()

    res.status(201).json(newImage);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteImage = async (req: Request, res: Response) => {
  const imageId = req.params.id;
  try {
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    if (
      image.user.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'You are not authorized to delete this image',
      });
    }
    fs.unlinkSync(image.imagePath);
    await image.deleteOne();

    res.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const searchImage = async (req: Request, res: Response) => {
  const usernameQuery = req.params.username;
  try {

    const users = await User.find({ username: { $regex: usernameQuery, $options: 'i' } });
    if (!users.length) {
      return res.status(404).json({ message: 'No users found matching the search query' });
    }

    const userIds = users.map(user => user._id);

    const images = await Image.find({ user: { $in: userIds } });
    if (!images.length) {
      return res.status(404).json({ message: 'No images found for the users matching the search query' });
    }

    res.json(images);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}