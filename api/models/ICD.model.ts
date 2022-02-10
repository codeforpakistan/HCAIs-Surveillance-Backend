
import mongoose, { Schema } from 'mongoose';
import { ICDCodesDto } from '../dto/icd-codes.dto';

const ICDCodeSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    ICDCode: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    surveillancePeriod: {
        type: Number
    }
}, { timestamps: true });

const ICDCode = mongoose.model<ICDCodesDto>('ICDCode', ICDCodeSchema);
export default ICDCode;