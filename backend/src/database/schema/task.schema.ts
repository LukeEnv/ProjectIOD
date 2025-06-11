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
      type: Schema.Types.ObjectId,
      ref: "Customers", // Assuming you have a Customer model
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
      type: Schema.Types.ObjectId,
      ref: "Users", // Assuming you have a User model
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
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
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<ITask>("Tasks", schema);
