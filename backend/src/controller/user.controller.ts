// In this file we will contain all the logic relating to handling user requests and responses,
// including logic for contacting the service layer to perform database operations for us.

import { Request, Response } from "express";
import bcrypt from "bcrypt";

import userSchema from "../database/schema/user.schema";
import { IUser } from "../database/model/user.model";
import { AuthenticatedRequest } from "../middleware/requireAuth.middleware";

export const getUsers = (req: Request, res: Response) => {
  userSchema
    .find({})
    .then((data: IUser[]) => res.send({ result: 200, data: data }))
    .catch((err: Error) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const data: IUser = req.body;
    // Hash the password before saving
    if (!data.password) {
      return res
        .status(400)
        .send({ result: 400, error: "Password is required" });
    }
    const saltRounds = 10;
    data.password = await bcrypt.hash(data.password, saltRounds);
    const newUser = await new userSchema(data).save();
    res.send({ result: 200, data: newUser });
  } catch (err: any) {
    console.log(err);
    res.send({ result: 500, error: err.message });
  }
};

export const updateUser = (req: Request, res: Response) => {
  console.log(req.body);
  userSchema
    .findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

export const deleteUser = (req: Request, res: Response) => {
  userSchema
    .findByIdAndDelete(req.params.id)
    .then((data) => res.send({ result: 200, data: data }))
    .catch((err) => {
      console.log(err);
      res.send({ result: 500, error: err.message });
    });
};

export const getMe = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const userObj =
    typeof req.user.toObject === "function" ? req.user.toObject() : req.user;
  if (userObj.password) delete userObj.password;
  res.json(userObj);
};
