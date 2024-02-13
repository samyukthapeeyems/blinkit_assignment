import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;

}

const UserSchema = new Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error: any) {
    throw new Error(error);
  }
};

UserSchema.set('toJSON', {
  transform: function (doc: any, ret: any, options: any) {
    delete ret.password;
    return ret;
  },
});

export default model<IUser>('User', UserSchema);

