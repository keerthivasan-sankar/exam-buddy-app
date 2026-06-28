import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  mobile: string;
  name: string;
  gender: string;
  homeCity: string;
  avatar?: string;
  verified: boolean;
  preferredTransport?: string;
  preferredLanguage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    mobile: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    homeCity: { type: String, required: true },
    avatar: { type: String },
    verified: { type: Boolean, default: false },
    preferredTransport: { type: String, default: 'Any' },
    preferredLanguage: { type: String, default: 'English' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
