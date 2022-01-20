
import mongoose, { Schema } from 'mongoose';
import {UserDto} from "../dto/user.dto";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: String,
    hospitalId: Schema.Types.ObjectId,
    roles: []
}, { timestamps: true });

const User = mongoose.model<UserDto>('User', UserSchema);
export default User;