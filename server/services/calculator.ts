/**
 * Financial Calculator Service
 * Provides calculations for different motorcycle purchase scenarios
 */

export interface CashPurchaseProjection {
  monthlyAverage: number;
  monthsToGoal: number;
  estimatedDate: Date;
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

export class CalculatorService {
  /**
   * Calculate cash purchase projection
   * Analyzes average deposits over last 3 months and projects when goal will be reached
   */
  static calculateCashPurchase(
    currentBalance: number,
    targetAmount: number,
    monthlyDeposits: number[]
  ): CashPurchaseProjection {
    // Calculate average of last 3 months (or available months)
    const recentDeposits = monthlyDeposits.slice(-3);
    const monthlyAverage =
      recentDeposits.length > 0
        ? recentDeposits.reduce((a, b) => a + b, 0) / recentDeposits.length
        : 0;

    const remainingAmount = Math.max(0, targetAmount - currentBalance);
    const monthsToGoal =
      monthlyAverage > 0 ? Math.ceil(remainingAmount / monthlyAverage) : 0;

    const estimatedDate = new Date();
    estimatedDate.setMonth(estimatedDate.getMonth() + monthsToGoal);

    return {
      monthlyAverage,
      monthsToGoal,
      estimatedDate,
      totalSaved: currentBalance,
      remainingAmount,
      achievable: monthlyAverage > 0,
    };
  }

  /**
   * Calculate financing with compound interest (Price Table)
   * Formula: PMT = PV × [i × (1 + i)^n] / [(1 + i)^n - 1]
   */
  static calculateFinancing(
    vehiclePrice: number,
    downPayment: number,
    monthlyInterestRate: number,
    numberOfInstallments: number
  ): FinancingCalculation {
    const principalAmount = vehiclePrice - downPayment;

    if (principalAmount <= 0) {
      return {
        monthlyPayment: 0,
        totalPayment: vehiclePrice,
        totalInterest: 0,
        interestPercentage: 0,
        numberOfInstallments,
        downPayment,
        finalAmount: vehiclePrice,
      };
    }

    // Price Table Formula
    const numerator =
      monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfInstallments);
    const denominator =
      Math.pow(1 + monthlyInterestRate, numberOfInstallments) - 1;
    const monthlyPayment = principalAmount * (numerator / denominator);

    const totalPayment = monthlyPayment * numberOfInstallments + downPayment;
    const totalInterest = totalPayment - vehiclePrice;
    const interestPercentage = (totalInterest / vehiclePrice) * 100;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      interestPercentage: Math.round(interestPercentage * 100) / 100,
      numberOfInstallments,
      downPayment,
      finalAmount: vehiclePrice,
    };
  }

  /**
   * Calculate consortium payment
   * Fixed monthly payment + administration fee
   */
  static calculateConsortium(
    vehiclePrice: number,
    downPayment: number,
    administrationFeePercentage: number,
    numberOfInstallments: number
  ): ConsortiumCalculation {
    const principalAmount = vehiclePrice - downPayment;
    const administrationFee = (vehiclePrice * administrationFeePercentage) / 100;
    const totalToFinance = principalAmount + administrationFee;

    const monthlyPayment = totalToFinance / numberOfInstallments;
    const totalMonthlyPayment = monthlyPayment;

    // Calculate if current savings is a good "lance" (bid)
    const lancePercentage = (downPayment / vehiclePrice) * 100;
    const isGoodLance = lancePercentage >= 20; // 20% is considered a good lance

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      administrationFee: Math.round(administrationFee * 100) / 100,
      totalMonthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
      numberOfInstallments,
      downPayment,
      lancePercentage: Math.round(lancePercentage * 100) / 100,
      isGoodLance,
    };
  }

  /**
   * Calculate real acquisition cost including additional expenses
   */
  static calculateRealAcquisitionCost(
    vehiclePrice: number,
    registrationFee: number = 0,
    transferFee: number = 0,
    insurancePercentage: number = 10,
    equipment: { name: string; price: number }[] = []
  ): {
    vehiclePrice: number;
    registrationFee: number;
    transferFee: number;
    insuranceCost: number;
    equipmentCost: number;
    totalCost: number;
  } {
    const insuranceCost = (vehiclePrice * insurancePercentage) / 100;
    const equipmentCost = equipment.reduce((sum, item) => sum + item.price, 0);
    const totalCost =
      vehiclePrice + registrationFee + transferFee + insuranceCost + equipmentCost;

    return {
      vehiclePrice,
      registrationFee,
      transferFee,
      insuranceCost: Math.round(insuranceCost * 100) / 100,
      equipmentCost,
      totalCost: Math.round(totalCost * 100) / 100,
    };
  }

  /**
   * Compare different purchase scenarios
   */
  static compareScenarios(
    vehiclePrice: number,
    currentBalance: number,
    monthlyDeposits: number[],
    annualInterestRate: number = 12
  ) {
    const monthlyInterestRate = annualInterestRate / 100 / 12;

    // Scenario 1: Cash Purchase
    const cashPurchase = this.calculateCashPurchase(
      currentBalance,
      vehiclePrice,
      monthlyDeposits
    );

    // Scenario 2: Financing (60 months, 12% annual interest)
    const financing = this.calculateFinancing(
      vehiclePrice,
      currentBalance,
      monthlyInterestRate,
      60
    );

    // Scenario 3: Consortium (60 months, 5% administration fee)
    const consortium = this.calculateConsortium(
      vehiclePrice,
      currentBalance,
      5,
      60
    );

    return {
      cashPurchase,
      financing,
      consortium,
      recommendation: this.getRecommendation(
        cashPurchase,
        financing,
        consortium
      ),
    };
  }

  /**
   * Get recommendation based on scenarios
   */
  private static getRecommendation(
    cashPurchase: CashPurchaseProjection,
    financing: FinancingCalculation,
    consortium: ConsortiumCalculation
  ): string {
    if (cashPurchase.achievable && cashPurchase.monthsToGoal <= 12) {
      return "Compra à vista é viável em menos de 1 ano. Recomendado poupar mais um pouco!";
    }

    if (financing.monthlyPayment < consortium.monthlyPayment) {
      return "Financiamento oferece melhor relação custo-benefício que consórcio.";
    }

    return "Considere suas opções com base na sua situação financeira atual.";
  }
}
