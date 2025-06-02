import { Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: Types.ObjectId; // Assuming userId is a reference to a User model
  createdAt: Date;
  updatedAt: Date;
}
