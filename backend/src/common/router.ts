// this file is basically where we setup all of our incoming routes and their handlers.

import { Express } from "express";
import userRoutes from "../routes/user.routes";
import customerRoutes from "../routes/customer.routes";
import taskRoutes from "../routes/task.routes";
import authRoutes from "../routes/auth.routes";

const routerSetup = (app: Express) => {
  app.use("/users", userRoutes);
  app.use("/customers", customerRoutes);
  app.use("/tasks", taskRoutes);
  app.use("/auth", authRoutes);

  // Add more routes here as needed
};

export default routerSetup;
