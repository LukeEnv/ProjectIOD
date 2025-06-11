import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../common/jwt";
import { findUserById } from "../service/user.service";
import { IUser } from "../database/model/user.model";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyAccessToken(token);
    console.log(decoded);
    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }
    // Ensure userId is a string for findUserById
    const userId = decoded.userId.toString();
    const user = await findUserById(userId);
    console.log(user);
    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    req.user = user;
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
