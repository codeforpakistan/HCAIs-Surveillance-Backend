
import mongoose, { Schema } from 'mongoose';
import { HospitalDto } from '../dto/hospital.dto';

const HospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    departments: [
        { 
            name: String,
            units: [{
                name: String,
            }] 
        }
    ]
}, { timestamps: true });

const Hospital = mongoose.model<HospitalDto>('Hospital', HospitalSchema);
export default Hospital;
