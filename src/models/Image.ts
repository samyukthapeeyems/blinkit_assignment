// models/Image.ts
import { Schema, Document, model } from 'mongoose';
import { IUser } from './User';

interface IImage extends Document {
  user: IUser['_id'];
  timestamp: Date;
  tags?: string[];
  description?: string;
  upvotes: number;
  downvotes: number;
  imagePath: string;
}

const ImageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  tags: [String],
  description: String,
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  imagePath: String,
});

export default model<IImage>('Image', ImageSchema);

