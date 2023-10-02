
import mongoose, { Schema } from 'mongoose';
import { OrganismDto } from '../dto/organisms.dto';

const OrganismSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        background: true
    },
}, { timestamps: true });

const Organism = mongoose.model<OrganismDto>('Organism', OrganismSchema);
export default Organism;
