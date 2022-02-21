import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    tokens: AuthToken[];
    profile: {
        name: string;
        gender: string;
        location: string;
        website: string;
        picture: string;
    };
    gravatar: (size: number) => string;
};


export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        password: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
        tokens: Array,
        profile: {
            name: String,
            gender: String,
            location: String,
            website: String,
            picture: String
        }
    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, null, (err: mongoose.Error, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

export const User = mongoose.model<UserDocument>('User', userSchema);