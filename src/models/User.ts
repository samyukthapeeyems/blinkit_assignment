import { Schema, model, Document } from "mongoose";

interface UserInterface extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema<UserInterface>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

export default model<UserInterface>("User", UserSchema);
