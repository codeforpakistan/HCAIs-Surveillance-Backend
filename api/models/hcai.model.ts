
import mongoose, { Schema } from 'mongoose';
import { HcaiDto } from "../dto/hcai.dto";

const HcaiSchema = new Schema({
    title: String,
    role: {
      type: String,
      index: true
    },
    submissionEndPoint: {
      type: String
    },
    requiredFields: [],
    description: String,
    category: String,
    steps: [{
        stepTitle: String,
        stepDescription: String,
        fields: []
    }],
}, { timestamps: true });

const Hcai = mongoose.model<HcaiDto>('Hcai', HcaiSchema);
export default Hcai;
