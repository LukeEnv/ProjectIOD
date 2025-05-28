// this file is basically where we setup all of our incoming routes and their handlers.

import { Express } from "express";
import userRoutes from "../routes/user.routes";

const routerSetup = (app: Express) => {
  app.use("/users", userRoutes);

  // Add more routes here as needed
};

export default routerSetup;
