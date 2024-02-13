import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
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

    let result = await newUser.save();
    console.log("emai", result.email)

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  passport.authenticate('local', { session: false }, async (err: any, user: IUser, info: any) => {
    try {
      if (err || !user) {
        return res.status(400).json({ message: info ? info.message : 'Login failed' });
      }

      req.login(user, { session: false }, async (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        const token = jwt.sign({ _id: user._id }, keys.secretOrKey);
        return res.json({ user, token });
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  })(req, res);
};

