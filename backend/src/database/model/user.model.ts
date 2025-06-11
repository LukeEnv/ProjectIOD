// We create this file to define the user model for our express application so our express application knows what types to handle when dealing with user data.
// Basically, this file will define the structure of the user document later used in the schema to define the schema in the MongoDB database
// and what fields it will contain and their types.

import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  createdAt: Date;
  updatedAt: Date;
  isAdmin?: boolean;
}
