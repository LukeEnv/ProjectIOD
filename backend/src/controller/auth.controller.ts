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
  req: Request, // the reason i have the {Username: string; password: string} is to define the type of the request body, so if someone tries to send a request with a different body structure, it will throw an error. And object means {}
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

  console.log("User found:", user);
  console.log("User password hash:", user.password);

  if (!user.password) {
    return res
      .status(500)
      .json({ message: "User record is missing password hash" });
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    accessToken,
    accessTokenExpiry: Date.now() + 15 * 60 * 1000, // 15 minutes expiry (adjust as needed)
    user: {
      _id: user._id,
      username: user.username,
    },
  });
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    console.log("HELLO????");
    console.log("Received refresh token:", token);
    if (!token) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }
    const payload = verifyRefreshToken(token);
    if (!payload) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }
    // Remove iat/exp from payload to avoid jwt sign error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...cleanPayload } = payload;
    const accessToken = generateAccessToken(cleanPayload);
    res.status(200).json({
      accessToken,
      accessTokenExpiry: Date.now() + 15 * 60 * 1000, // 15 minutes expiry
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Logging out user");
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
