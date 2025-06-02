// We create this file to define the user schema for our application.
// Basically, this file will define the structure of the user document in the MongoDB database side, and not on the express application.
// What validation rules it will have, and how it will be stored in the database.

// Our model will define the basic structure of the user document which will get used throughout the express application.
// This schema will be used to interact with the MongoDB database using Mongoose, with validation requirements, default data and rules.

import { Schema, model } from "mongoose";
import { IUser } from "../model/user.model";

const schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
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

export default model<IUser>("Users", schema);
