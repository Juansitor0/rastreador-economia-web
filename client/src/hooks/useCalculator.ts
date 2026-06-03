import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export interface CashPurchaseProjection {
  monthlyAverage: number;
  monthsToGoal: number;
  estimatedDate: string;
  totalSaved: number;
  remainingAmount: number;
  achievable: boolean;
}

export interface FinancingCalculation {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  interestPercentage: number;
  numberOfInstallments: number;
  downPayment: number;
  finalAmount: number;
}

export interface ConsortiumCalculation {
  monthlyPayment: number;
  administrationFee: number;
  totalMonthlyPayment: number;
  numberOfInstallments: number;
  downPayment: number;
  lancePercentage: number;
  isGoodLance: boolean;
}

export interface RealAcquisitionCost {
  vehiclePrice: number;
  registrationFee: number;
  transferFee: number;
  insuranceCost: number;
  equipmentCost: number;
  totalCost: number;
}

export interface ScenarioComparison {
  cashPurchase: CashPurchaseProjection;
  financing: FinancingCalculation;
  consortium: ConsortiumCalculation;
  recommendation: string;
}

export function useCalculator() {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCashPurchase = useCallback(
    async (
      currentBalance: number,
      targetAmount: number,
      monthlyDeposits: number[]
    ): Promise<CashPurchaseProjection | null> => {
      setLoading(true);
      setError(null);
      const data = await api.post<CashPurchaseProjection>(
        "/calculator/cash-purchase",
        {
          currentBalance,
          targetAmount,
          monthlyDeposits,
        },
        false
      );
      setLoading(false);
      if (!data && api.error) {
        setError(api.error);
      }
      return data;
    },
    [api]
  );

  const calculateFinancing = useCallback(
    async (
      vehiclePrice: number,
      downPayment: number,
      annualInterestRate?: number,
      numberOfInstallments?: number
    ): Promise<FinancingCalculation | null> => {
      setLoading(true);
      setError(null);
      const data = await api.post<FinancingCalculation>(
        "/calculator/financing",
        {
          vehiclePrice,
          downPayment,
          annualInterestRate: annualInterestRate || 12,
          numberOfInstallments: numberOfInstallments || 60,
        },
        false
      );
      setLoading(false);
      if (!data && api.error) {
        setError(api.error);
      }
      return data;
    },
    [api]
  );

  const calculateConsortium = useCallback(
    async (
      vehiclePrice: number,
      downPayment: number,
      administrationFeePercentage?: number,
      numberOfInstallments?: number
    ): Promise<ConsortiumCalculation | null> => {
      setLoading(true);
      setError(null);
      const data = await api.post<ConsortiumCalculation>(
        "/calculator/consortium",
        {
          vehiclePrice,
          downPayment,
          administrationFeePercentage: administrationFeePercentage || 5,
          numberOfInstallments: numberOfInstallments || 60,
        },
        false
      );
      setLoading(false);
      if (!data && api.error) {
        setError(api.error);
      }
      return data;
    },
    [api]
  );

  const calculateRealAcquisitionCost = useCallback(
    async (
      vehiclePrice: number,
      registrationFee?: number,
      transferFee?: number,
      insurancePercentage?: number,
      equipment?: { name: string; price: number }[]
    ): Promise<RealAcquisitionCost | null> => {
      setLoading(true);
      setError(null);
      const data = await api.post<RealAcquisitionCost>(
        "/calculator/real-acquisition-cost",
        {
          vehiclePrice,
          registrationFee,
          transferFee,
          insurancePercentage,
          equipment,
        },
        false
      );
      setLoading(false);
      if (!data && api.error) {
        setError(api.error);
      }
      return data;
    },
    [api]
  );

  const compareScenarios = useCallback(
    async (
      vehiclePrice: number,
      annualInterestRate?: number
    ): Promise<ScenarioComparison | null> => {
      setLoading(true);
      setError(null);
      const data = await api.post<ScenarioComparison>(
        "/calculator/compare-scenarios",
        {
          vehiclePrice,
          annualInterestRate,
        },
        true
      );
      setLoading(false);
      if (!data && api.error) {
        setError(api.error);
      }
      return data;
    },
    [api]
  );

  return {
    loading,
    error,
    calculateCashPurchase,
    calculateFinancing,
    calculateConsortium,
    calculateRealAcquisitionCost,
    compareScenarios,
  };
}
