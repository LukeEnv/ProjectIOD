import { Schema, model } from "mongoose";
import { IRefreshToken } from "../model/refresh-token.model";

const schema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users", // Assuming you have a User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IRefreshToken>("Refresh-Tokens", schema);
