// In this file we will contain all the logic relating to handling user requests and responses,
// including logic for contacting the service layer to perform database operations for us.

import { Request, Response } from "express";
import { findUserByUsername } from "../service/user.service";
import bcrypt from "bcrypt";

import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../common/jwt";
import { Types } from "mongoose";

//let userModel = require("../database/schema/user.schema");

export const loginUser = async (
  req: Request<object, object, { username: string; password: string }>, // the reason i have the {Username: string; password: string} is to define the type of the request body, so if someone tries to send a request with a different body structure, it will throw an error. And object means {}
  res: Response
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const user = await findUserByUsername(username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const userPayload: TokenPayload = {
    userId: user._id as Types.ObjectId,
    username: user.username,
  };

  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {};
