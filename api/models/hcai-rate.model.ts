
import mongoose, { Schema } from 'mongoose';

const HCAIRateSchema = new Schema({
}, { timestamps: true, strict: false });

const Hcai = mongoose.model<any>('Hcai-rate', HCAIRateSchema);
export default Hcai;
