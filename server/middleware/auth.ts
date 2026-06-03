import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.js";
import { JWTPayload } from "../types.js";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Token não fornecido" });
  }

  const token = authHeader.substring(7);
  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: "Token inválido ou expirado" });
  }

  req.user = decoded;
  next();
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = AuthService.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}
