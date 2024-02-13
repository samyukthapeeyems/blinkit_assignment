import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as secret from '../config/keys';
import User from '../models/User';
import passport from 'passport';
import passportLocal from 'passport-local';


export const jwtStrategy = () => passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret.default.secretOrKey,
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload._id);
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



const LocalStrategy = passportLocal.Strategy;

export const localStrategy = () => passport.use(new LocalStrategy(
    {
        usernameField: 'email',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: any, user: any) => {
        done(err, user);
    });
});
