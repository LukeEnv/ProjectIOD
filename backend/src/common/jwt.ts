import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret";

export type TokenPayload = {
  userId: Types.ObjectId;
  username: string;
  token?: string;
  iat?: number;
  exp?: number;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  console.log(ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  // Set the token in the payload
  console.log(REFRESH_TOKEN_SECRET);
  payload.token = uuidv4();
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
};
