import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userSchema from "../database/schema/user.schema";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1];
  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
  userSchema
    .findById(decoded.id)
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }
      // @ts-expect-error req.user is set by middleware for downstream use
      req.user = { id: user._id.toString(), isAdmin: user.isAdmin };
      next();
    })
    .catch(() => {
      res.status(401).json({ message: "Invalid or expired token" });
    });
}
