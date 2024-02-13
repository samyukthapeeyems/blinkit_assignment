// middlewares/authenticate.ts
import passport from 'passport';
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401)
        }
        req.user = user;
        next();
    })(req, res, next);

};

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access forbidden' });
        }
        next();
    };
};



