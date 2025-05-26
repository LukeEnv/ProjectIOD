import { Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    requirements: string;
    notes: string;
    customerId: number;
    dueDate: Date;
    status: string;
    userId: number;

    createdAt: Date;
    updatedAt: Date;
}
