import { useEffect, useState } from "react";
import { useFipe } from "@/hooks/useFipe";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FipeMotorcycleSelectorProps {
  onPriceSelected: (price: number, motorcycle: string) => void;
}

export default function FipeMotorcycleSelector({
  onPriceSelected,
}: FipeMotorcycleSelectorProps) {
  const {
    brands,
    models,
    years,
    loading,
    error,
    fetchBrands,
    fetchModels,
    fetchYears,
    fetchPrice,
  } = useFipe();

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedModel("");
    setSelectedYear("");
    if (brandId) {
      fetchModels(brandId);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    setSelectedYear("");
    if (selectedBrand && modelId) {
      fetchYears(selectedBrand, modelId);
    }
  };

  const handleYearChange = (yearId: string) => {
    setSelectedYear(yearId);
  };

  const handleConfirm = async () => {
    if (!selectedBrand || !selectedModel || !selectedYear) {
      toast.error("Selecione marca, modelo e ano");
      return;
    }

    const price = await fetchPrice(selectedBrand, selectedModel, selectedYear);
    if (price) {
      const motorcycleName = `${
        brands.find((b) => b.id === selectedBrand)?.name
      } ${models.find((m) => m.id === selectedModel)?.name} ${
        years.find((y) => y.id === selectedYear)?.name
      }`;

      onPriceSelected(price.value, motorcycleName);
      toast.success(`Meta atualizada para ${motorcycleName}`);
    } else {
      toast.error(error || "Erro ao buscar preço");
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">
        Selecionar Moto pela Tabela FIPE
      </h3>

      <div className="space-y-3">
        {/* Brand Select */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Marca
          </label>
          <Select value={selectedBrand} onValueChange={handleBrandChange}>
            <SelectTrigger disabled={loading || brands.length === 0}>
              <SelectValue placeholder="Selecione uma marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Select */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Modelo
          </label>
          <Select
            value={selectedModel}
            onValueChange={handleModelChange}
            disabled={!selectedBrand || loading || models.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um modelo" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Select */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Ano
          </label>
          <Select
            value={selectedYear}
            onValueChange={handleYearChange}
            disabled={!selectedModel || loading || years.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

        <Button
          onClick={handleConfirm}
          disabled={!selectedBrand || !selectedModel || !selectedYear || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Carregando...
            </>
          ) : (
            "Confirmar Seleção"
          )}
        </Button>
      </div>
    </div>
  );
}
