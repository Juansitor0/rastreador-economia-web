import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, DollarSign } from "lucide-react";


interface InstallmentCalculatorProps {
  currentSavings: number;
}


export default function InstallmentCalculator({
  currentSavings,
}: InstallmentCalculatorProps) {
  const [motoPrice, setMotoPrice] = useState("");
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [interestRate, setInterestRate] = useState("0");
  const [interestPeriod, setInterestPeriod] = useState<"monthly" | "annual">("annual");
  const [calculationType, setCalculationType] = useState<"no-interest" | "with-interest">("no-interest");
  const [entryPercentage, setEntryPercentage] = useState(30);
  const [customEntry, setCustomEntry] = useState("");


  const handlePriceChange = (e: string) => {
    setMotoPrice(e.replace(/\D/g, ""));
  };


  const handleInterestChange = (e: string) => {
    setInterestRate(e.replace(/[^\d.]/g, "").slice(0, 5));
  };


  const handleEntryPercentageChange = (e: string) => {
    const value = parseInt(e.replace(/\D/g, "") || "0");
    if (value >= 0 && value <= 100) {
      setEntryPercentage(value);
      setCustomEntry("");
    }
  };


  const handleCustomEntryChange = (e: string) => {
    setCustomEntry(e.replace(/\D/g, ""));
  };


  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };


  const price = parseFloat(motoPrice || "0") / 100;
  
  // Determinar entrada: usar valor customizado ou porcentagem
  let entry = 0;
  if (customEntry) {
    entry = parseFloat(customEntry) / 100;
  } else {
    entry = (price * entryPercentage) / 100;
  }
  
  const remaining = price - entry;


  // Cálculo sem juros
  const monthlyPaymentNoInterest = remaining > 0 ? remaining / selectedMonths : 0;


  // Cálculo com juros simples
  let monthlyPaymentWithInterest = 0;
  let totalWithInterest = 0;
  let totalInterest = 0;


  if (remaining > 0 && calculationType === "with-interest") {
