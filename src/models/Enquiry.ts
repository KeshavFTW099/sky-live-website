import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email: string;
  message: string;
  productName?: string;
  serviceName?: string;
  categoryName?: string;
  pageUrl?: string;
  timestamp: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    company: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true },
    productName: { type: String, default: '' },
    serviceName: { type: String, default: '' },
    categoryName: { type: String, default: '' },
    pageUrl: { type: String, default: '' },
    timestamp: { type: Schema.Types.Date, default: Date.now }
  },
  { timestamps: true }
);

import { Model } from 'mongoose';

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
export default Enquiry;
