import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import * as passportJWT from "passport-jwt";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import imageRoutes from "./routes/image";
import keys from "./config/keys";

dotenv.config();

const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = passportJWT;

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Configuration
const mongoURI = keys.mongoURI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport JWT Strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: keys.secretOrKey
    },
    (jwtPayload: any, done: (error: any, user?: any) => void) => {
      try {
        if (jwtPayload) {
          return done(null, jwtPayload);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
