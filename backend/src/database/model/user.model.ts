// We create this file to define the user model for our application.
// Basically, this file will define the structure of the user document in the MongoDB database and what fields it will contain and their types.

import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  createdAt: Date;
  updatedAt: Date;
}
