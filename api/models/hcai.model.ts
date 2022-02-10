
import mongoose, { Schema } from 'mongoose';
import { HcaiDto } from "../dto/hcai.dto";

const HcaiSchema = new Schema({
    title: String,
    fields: []
}, { timestamps: true });

const Hcai = mongoose.model<HcaiDto>('Hcai', HcaiSchema);
export default Hcai;