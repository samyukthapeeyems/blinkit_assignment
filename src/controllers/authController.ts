import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../config/keys";
import passport from "passport";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ email, password });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');
        return next(error);
      }
      req.login(user, { session: false }, (error) => {
        if (error) return next(error);
        const token = jwt.sign({ id: user.id }, keys.secretOrKey);
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
