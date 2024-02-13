// middlewares/authenticate.ts
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as secret from '../config/keys';
import User from '../models/User'; // Assuming you have a User model

export const authMiddleware = passport.authenticate("jwt", { session: false });

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret.default.secretOrKey,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
