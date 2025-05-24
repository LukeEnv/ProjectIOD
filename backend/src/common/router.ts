// this file is basically where we setup all of our incoming routes and their handlers.

import { Express, Request, Response } from "express";

const routerSetup = (app: Express) =>
  app.get("/", async (req: Request, res: Response) => {
    res.send("Hello Express API!");
  });

export default routerSetup;
