// this file is basically where we setup all of our incoming routes and their handlers.

import { Express } from "express";
import userRoutes from "../routes/user.routes";
import customerRoutes from "../routes/customer.routes";
import taskRoutes from "../routes/task.routes";

const routerSetup = (app: Express) => {
    app.use("/users", userRoutes);
    app.use("/customers", customerRoutes);
    app.use("/tasks", taskRoutes);

    // Add more routes here as needed
};

export default routerSetup;
