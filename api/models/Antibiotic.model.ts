
import mongoose, { Schema } from 'mongoose';
import { AntibioticDto } from '../dto/antibiotics.dto';

const AntibioticSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
}, { timestamps: true });

const Antibiotic = mongoose.model<AntibioticDto>('Antibiotic', AntibioticSchema);
export default Antibiotic;
