// this file is used to initialise the application and set up all the port connections and database connections.

import { Express } from "express";
import mongooseConnect from "../database/mongodb";

const appSetup = async (app: Express) => {
  // set database connections

  try {
    await mongooseConnect();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    //process.exit(1); // Exit the process if the connection fails
  }

  const APP_PORT = 3000;

  app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
  });
};

export default appSetup;
