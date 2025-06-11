// this file is used to initialise the application and set up all the port connections and database connections.

import express, { Express } from "express";
import mongooseConnect from "../database/mongodb"; // temporarily commented out to avoid errors during initial setup as we dont have a database connection set up yet.

const appSetup = async (app: Express) => {
  // set database connections

  app.use(express.json()); // Middleware to parse JSON bodies

  try {
    await mongooseConnect();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    //process.exit(1); // Exit the process if the connection fails
  }

  const APP_PORT = 4000;

  app.listen(APP_PORT, () => {
    console.log(`Server started on port ${APP_PORT}`);
  });
};

export default appSetup;
