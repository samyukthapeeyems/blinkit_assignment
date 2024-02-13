// models/Image.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  user: string;
  timestamp: Date;
  tags: string[];
  description: string;
  upvotes: number;
  downvotes: number;
}

const ImageSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  tags: [{ type: String }],
  description: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
});

export default mongoose.model<IImage>('Image', ImageSchema);
