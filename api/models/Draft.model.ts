
import mongoose, { Schema } from 'mongoose';

const DraftSchema = new Schema({
  surgeon: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        background: true
    },
    isSubmitted: {
        type: Boolean,
        index: true,
        background: true
    },
    hospitalId: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        index: true,
        background: true
    },
    hcaiId: {
        type: Schema.Types.ObjectId,
        index: true,
        background: true
    }
}, { timestamps: true, strict: false });

const Draft = mongoose.model<any>('Draft', DraftSchema);
export default Draft;
