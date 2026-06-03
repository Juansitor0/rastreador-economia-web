import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface PrivacyModeToggleProps {
  onToggle?: (isPrivate: boolean) => void;
}

export default function PrivacyModeToggle({ onToggle }: PrivacyModeToggleProps) {
  const [isPrivateMode, setIsPrivateMode] = useLocalStorage("privacyMode", false);

  const handleToggle = () => {
    const newValue = !isPrivateMode;
    setIsPrivateMode(newValue);
    onToggle?.(newValue);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="gap-2"
      title={isPrivateMode ? "Modo Privado Ativo" : "Modo Privado Inativo"}
    >
      {isPrivateMode ? (
        <>
          <EyeOff className="w-4 h-4" />
          <span className="hidden sm:inline">Privado</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Público</span>
        </>
      )}
    </Button>
  );
}

/**
 * Hook para usar o modo privado em componentes
 */
export function usePrivacyMode() {
  const [isPrivateMode] = useLocalStorage("privacyMode", false);

  const maskValue = (value: string | number): string => {
    if (!isPrivateMode) {
      return String(value);
    }
    return "***";
  };

  const maskCurrency = (value: number): string => {
    if (!isPrivateMode) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    return "***";
  };

  return {
    isPrivateMode,
    maskValue,
    maskCurrency,
  };
}
