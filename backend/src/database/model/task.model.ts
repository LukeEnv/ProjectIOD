import { Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  requirements: string;
  notes: string;
  customerId: number;
  dueDate: Date;
  status: string;
  userId: Types.ObjectId; // Assuming userId is a reference to a User model

  createdAt: Date;
  updatedAt: Date;
}
