import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import imageRoutes from "./routes/image";
import keys from "./config/keys";
import { jwtStrategy, localStrategy } from "./middleware/strategy"
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../uploads')))
console.log(path.join(__dirname, '../uploads'))

const mongoURI = keys.mongoURI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());
localStrategy()
jwtStrategy()

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
