import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../services/database.js";
import { UpdateFinancialProfileSchema, TransactionSchema } from "../schemas/financial.js";

const router = Router();

/**
 * GET /financial/profile
 * Get user's financial profile (requires authentication)
 */
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Não autenticado" });
    }

    const profile = await db.getFinancialProfileByUserId(req.user.userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: "Perfil financeiro não encontrado" });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro ao buscar perfil financeiro" });
  }
});

/**
 * PUT /financial/profile
 * Update user's financial profile (requires authentication)
 */
router.put("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Não autenticado" });
    }

    const updates = UpdateFinancialProfileSchema.parse(req.body);
    const profile = await db.getFinancialProfileByUserId(req.user.userId);

    if (!profile) {
      return res.status(404).json({ success: false, error: "Perfil financeiro não encontrado" });
    }

    const updated = await db.updateFinancialProfile(profile.id, updates);
    res.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao atualizar perfil financeiro" });
    }
  }
});

/**
 * GET /financial/transactions
 * Get user's transactions (requires authentication)
 */
router.get("/transactions", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Não autenticado" });
    }

    const profile = await db.getFinancialProfileByUserId(req.user.userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: "Perfil financeiro não encontrado" });
    }

    const transactions = await db.getTransactionsByProfileId(profile.id);
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro ao buscar transações" });
  }
});

/**
 * POST /financial/transactions
 * Create a new transaction (requires authentication)
 */
router.post("/transactions", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Não autenticado" });
    }

    const transactionData = TransactionSchema.parse(req.body);
    const profile = await db.getFinancialProfileByUserId(req.user.userId);

    if (!profile) {
      return res.status(404).json({ success: false, error: "Perfil financeiro não encontrado" });
    }

    const transaction = await db.createTransaction(profile.id, {
      ...transactionData,
      date: new Date(transactionData.date),
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao criar transação" });
    }
  }
});

/**
 * DELETE /financial/transactions/:id
 * Delete a transaction (requires authentication)
 */
router.delete("/transactions/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Não autenticado" });
    }

    const { id } = req.params;
    const deleted = await db.deleteTransaction(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Transação não encontrada" });
    }

    res.json({ success: true, message: "Transação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro ao deletar transação" });
  }
});

export default router;
