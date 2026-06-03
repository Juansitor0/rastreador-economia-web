import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validação falhou",
      details: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
  });
}
