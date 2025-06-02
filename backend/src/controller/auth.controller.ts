// In this file we will contain all the logic relating to handling user requests and responses,
// including logic for contacting the service layer to perform database operations for us.

import { Request, Response } from "express";

//let userModel = require("../database/schema/user.schema");

export const loginUser = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) => {};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {};
