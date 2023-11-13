
import mongoose, { Schema } from 'mongoose';

const AddressesSchema = new mongoose.Schema({

}, { strict : false, timestamps: true });

export default mongoose.model<any>('Address', AddressesSchema);