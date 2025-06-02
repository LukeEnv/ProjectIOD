// In this file we will contain all the logic relating to contacting the database to perform operations on the user model.
import userSchema from "../database/schema/user.schema";

export const findUserByUsername = async (username: string) => {
  // return a promise that resolves to IUser or null

  // Find the user by username
  const user = await userSchema.findOne({ username });

  // Return the user object
  return user;
};
