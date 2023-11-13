
import mongoose, { Schema } from 'mongoose';

const DraftSchema = new Schema({
}, { timestamps: true, strict: false });

const Draft = mongoose.model<any>('Draft', DraftSchema);
export default Draft;
