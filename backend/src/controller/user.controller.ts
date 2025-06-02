// In this file we will contain all the logic relating to handling user requests and responses,
// including logic for contacting the service layer to perform database operations for us.

import { Request, Response } from "express";

//let userModel = require("../database/schema/user.schema");
import userSchema from "../database/schema/user.schema";
import { IUser } from "../database/model/user.model";

export const getUsers = (req: Request, res: Response) => {
  userSchema
    .find({})
    .then((data: IUser[]) => res.send({ result: 200, data: data }))
    .catch((err: Error) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

export const createUser = (req: Request, res: Response) => {
  const data: IUser = req.body;
  console.log(req.body);
  console.log(data);
  new userSchema(data)
    .save()
    .then((data: IUser) => res.send({ result: 200, data: data }))
    .catch((err: Error) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};
