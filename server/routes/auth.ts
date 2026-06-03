import { Router, Request, Response } from "express";
import { AuthService } from "../services/auth.js";
import { RegisterSchema, LoginSchema } from "../schemas/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../services/database.js";

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body);
    const result = await AuthService.register(name, email, password);

    if ("error" in result) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao registrar" });
    }
  }
});

/**
 * POST /auth/login
 * Login a user
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const result = await AuthService.login(email, password);

    if ("error" in result) {
      return res.status(401).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao fazer login" });
    }
  }
});

/**
 * GET /auth/me
 * Get current user info (requires authentication)
 */
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Não autenticado" });
    }

    const user = await db.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro ao buscar usuário" });
  }
});

export default router;
