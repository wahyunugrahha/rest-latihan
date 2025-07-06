import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  if (!token) {
    return res.status(401).json({ errors: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prismaClient.user.findUnique({
      where: {
        username: decoded.username,
      },
    });

    if (!user) {
      return res.status(401).json({ errors: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Unauthorized" });
  }
};
