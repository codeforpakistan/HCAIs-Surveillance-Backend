
import mongoose, { Schema } from 'mongoose';
import { SubmissionDto } from '../dto/submission.dto';
const SubmissioneSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    hospitalId: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    },
}, { timestamps: true, strict: false});

const Submission = mongoose.model<SubmissionDto>('Submission', SubmissioneSchema);
export default Submission;