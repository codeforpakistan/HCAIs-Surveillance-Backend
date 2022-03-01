import passport from "passport";
import passportLocal from "passport-local";
import { User, UserDocument } from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";
import bcrypt from 'bcrypt';
import { sign, SignOptions } from 'jsonwebtoken';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: NativeError, user: UserDocument) => done(err, user));
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, async (err: NativeError, user: UserDocument) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = sign(user.toJSON(), (process.env.secret || 'secret'), {
                    expiresIn: 604800 // 1 week
                });
                user.tokens.push({
                    accessToken: token,
                    kind: 'jwt'
                });
                return done(undefined, user);
            } else {
                return done(undefined, false, { message: "Invalid password." });
            }
        } catch(err) {
            console.error(err);
            return done(undefined, false, { message: "Invalid email or password." });
        }
    });
}));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({error: `UnAuthorized`});
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];
    const user = req.user as UserDocument;
    if (user.tokens, { kind: provider }) {
        next();
    } else {
        res.status(401).send({error: `UnAuthorized`});
    }
};