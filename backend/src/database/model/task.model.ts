import { Document, Types } from "mongoose";

export interface ITask extends Document {
  title: string;
  requirements: string;
  notes: string;
  customerId: Types.ObjectId; // Assuming customerId is a reference to a Customer model
  dueDate: Date;
  status: string;
  userId: Types.ObjectId; // Assuming userId is a reference to a User model
  createdBy: Types.ObjectId; // User who created the task
  createdAt: Date;
  updatedAt: Date;
}
