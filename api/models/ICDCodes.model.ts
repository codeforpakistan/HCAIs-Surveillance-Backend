
import mongoose, { Schema } from 'mongoose';
import { ICDCodeDto } from '../dto/icd-codes.dto';

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

const ICDCode = mongoose.model<ICDCodeDto>('ICD-Code', ICDCodeSchema);
export default ICDCode;