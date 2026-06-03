import { Router, Request, Response } from "express";
import { fipeService } from "../services/fipe.js";

const router = Router();

/**
 * GET /fipe/brands
 * Get all motorcycle brands from FIPE
 */
router.get("/brands", async (req: Request, res: Response) => {
  try {
    const brands = await fipeService.getBrands();
    res.json({ success: true, data: brands });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscar marcas";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

/**
 * GET /fipe/brands/:brandId/models
 * Get motorcycle models for a specific brand
 */
router.get("/brands/:brandId/models", async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    const models = await fipeService.getModels(brandId);
    res.json({ success: true, data: models });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscar modelos";
    res.status(500).json({ success: false, error: errorMessage });
  }
});

/**
 * GET /fipe/brands/:brandId/models/:modelId/years
 * Get available years for a specific model
 */
router.get(
  "/brands/:brandId/models/:modelId/years",
  async (req: Request, res: Response) => {
    try {
      const { brandId, modelId } = req.params;
      const years = await fipeService.getYears(brandId, modelId);
      res.json({ success: true, data: years });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar anos";
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
);

/**
 * GET /fipe/brands/:brandId/models/:modelId/years/:yearId
 * Get price for a specific motorcycle
 */
router.get(
  "/brands/:brandId/models/:modelId/years/:yearId",
  async (req: Request, res: Response) => {
    try {
      const { brandId, modelId, yearId } = req.params;
      const price = await fipeService.getPrice(brandId, modelId, yearId);
      res.json({ success: true, data: price });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar preço";
      res.status(500).json({ success: false, error: errorMessage });
    }
  }
);

export default router;
