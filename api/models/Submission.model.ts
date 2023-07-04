
import mongoose, { Schema } from 'mongoose';
import { SubmissionDto } from '../dto/submission.dto';
const SubmissioneSchema = new mongoose.Schema({
    surgeon: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isSubmitted: {
        type: Boolean,
        index: true
    },
    hospitalId: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        index: true
    },
    hcaiId: {
        type: Schema.Types.ObjectId,
        index: true
    },
    ICD10Id: {
        type: Schema.Types.ObjectId,
        ref: 'ICD-Code',
        index: true
    }
}, { timestamps: true, strict: false});

const Submission = mongoose.model<SubmissionDto>('Submission', SubmissioneSchema);
export default Submission;
