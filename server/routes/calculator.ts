import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { db } from "../services/database.js";
import { CalculatorService } from "../services/calculator.js";
import { z } from "zod";

const router = Router();

// Validation schemas
const CashPurchaseSchema = z.object({
  currentBalance: z.number().nonnegative(),
  targetAmount: z.number().positive(),
  monthlyDeposits: z.array(z.number().nonnegative()),
});

const FinancingSchema = z.object({
  vehiclePrice: z.number().positive(),
  downPayment: z.number().nonnegative(),
  annualInterestRate: z.number().positive().default(12),
  numberOfInstallments: z.number().positive().default(60),
});

const ConsortiumSchema = z.object({
  vehiclePrice: z.number().positive(),
  downPayment: z.number().nonnegative(),
  administrationFeePercentage: z.number().positive().default(5),
  numberOfInstallments: z.number().positive().default(60),
});

const RealAcquisitionCostSchema = z.object({
  vehiclePrice: z.number().positive(),
  registrationFee: z.number().nonnegative().optional(),
  transferFee: z.number().nonnegative().optional(),
  insurancePercentage: z.number().nonnegative().optional(),
  equipment: z
    .array(
      z.object({
        name: z.string(),
        price: z.number().nonnegative(),
      })
    )
    .optional(),
});

/**
 * POST /calculator/cash-purchase
 * Calculate cash purchase projection
 */
router.post("/cash-purchase", async (req: Request, res: Response) => {
  try {
    const data = CashPurchaseSchema.parse(req.body);
    const result = CalculatorService.calculateCashPurchase(
      data.currentBalance,
      data.targetAmount,
      data.monthlyDeposits
    );
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao calcular" });
    }
  }
});

/**
 * POST /calculator/financing
 * Calculate financing payment
 */
router.post("/financing", async (req: Request, res: Response) => {
  try {
    const data = FinancingSchema.parse(req.body);
    const monthlyInterestRate = data.annualInterestRate / 100 / 12;
    const result = CalculatorService.calculateFinancing(
      data.vehiclePrice,
      data.downPayment,
      monthlyInterestRate,
      data.numberOfInstallments
    );
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao calcular" });
    }
  }
});

/**
 * POST /calculator/consortium
 * Calculate consortium payment
 */
router.post("/consortium", async (req: Request, res: Response) => {
  try {
    const data = ConsortiumSchema.parse(req.body);
    const result = CalculatorService.calculateConsortium(
      data.vehiclePrice,
      data.downPayment,
      data.administrationFeePercentage,
      data.numberOfInstallments
    );
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao calcular" });
    }
  }
});

/**
 * POST /calculator/real-acquisition-cost
 * Calculate real acquisition cost including additional expenses
 */
router.post("/real-acquisition-cost", async (req: Request, res: Response) => {
  try {
    const data = RealAcquisitionCostSchema.parse(req.body);
    const result = CalculatorService.calculateRealAcquisitionCost(
      data.vehiclePrice,
      data.registrationFee,
      data.transferFee,
      data.insurancePercentage,
      data.equipment
    );
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(400).json({ success: false, error: "Erro ao calcular" });
    }
  }
});

/**
 * POST /calculator/compare-scenarios
 * Compare all purchase scenarios
 */
router.post(
  "/compare-scenarios",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Não autenticado" });
      }

      const { vehiclePrice, annualInterestRate } = z
        .object({
          vehiclePrice: z.number().positive(),
          annualInterestRate: z.number().positive().optional(),
        })
        .parse(req.body);

      // Get user's financial profile
      const profile = await db.getFinancialProfileByUserId(req.user.userId);
      if (!profile) {
        return res
          .status(404)
          .json({ success: false, error: "Perfil financeiro não encontrado" });
      }

      // Get user's transactions to calculate monthly deposits
      const transactions = await db.getTransactionsByProfileId(profile.id);
      const monthlyDeposits = transactions
        .filter((t) => t.type === "deposit")
        .slice(-3)
        .map((t) => t.amount);

      const currentBalance =
        profile.initial_balance +
        transactions.reduce((sum, t) => {
          return t.type === "deposit" ? sum + t.amount : sum - t.amount;
        }, 0);

      const result = CalculatorService.compareScenarios(
        vehiclePrice,
        currentBalance,
        monthlyDeposits,
        annualInterestRate
      );

      res.json({ success: true, data: result });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, error: error.message });
      } else {
        res.status(400).json({ success: false, error: "Erro ao calcular" });
      }
    }
  }
);

export default router;
