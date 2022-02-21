import passport from "passport";
import passportLocal from "passport-local";
import { User, UserDocument } from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import { NativeError } from "mongoose";
import argon2 from 'argon2';

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
            if (await argon2.verify(user.password, password)) {
                console.info('here');
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
    res.redirect("/login");
};

/**
 * Authorization Required middleware.
 */
// export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
//     const provider = req.path.split("/").slice(-1)[0];

//     const user = req.user as UserDocument;
//     if (find(user.tokens, { kind: provider })) {
//         next();
//     } else {
//         res.redirect(`/auth/${provider}`);
//     }
// };