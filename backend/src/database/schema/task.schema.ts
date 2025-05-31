import { Schema, model } from "mongoose";
import { ITask } from "../model/task.model";

const schema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        requirements: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
        customerId: {
            type: Number,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        userId: {
            type: Number,
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

export default model<ITask>("task", schema);
