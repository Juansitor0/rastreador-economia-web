import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export interface FipeBrand {
  id: string;
  name: string;
}

export interface FipeModel {
  id: string;
  name: string;
}

export interface FipeYear {
  id: string;
  name: string;
}

export interface FipePrice {
  name: string;
  value: number;
  brand: string;
  model: string;
  modelYear: string;
  fuel: string;
  transmission: string;
  id: string;
}

export function useFipe() {
  const api = useApi();
  const [brands, setBrands] = useState<FipeBrand[]>([]);
  const [models, setModels] = useState<FipeModel[]>([]);
  const [years, setYears] = useState<FipeYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await api.get<FipeBrand[]>("/fipe/brands", false);
    if (data) {
      setBrands(data);
    } else {
      setError(api.error || "Erro ao buscar marcas");
    }
    setLoading(false);
  }, [api]);

  const fetchModels = useCallback(
    async (brandId: string) => {
      setLoading(true);
      setError(null);
      setModels([]);
      const data = await api.get<FipeModel[]>(
        `/fipe/brands/${brandId}/models`,
        false
      );
      if (data) {
        setModels(data);
      } else {
        setError(api.error || "Erro ao buscar modelos");
      }
      setLoading(false);
    },
    [api]
  );

  const fetchYears = useCallback(
    async (brandId: string, modelId: string) => {
      setLoading(true);
      setError(null);
      setYears([]);
      const data = await api.get<FipeYear[]>(
        `/fipe/brands/${brandId}/models/${modelId}/years`,
        false
      );
      if (data) {
        setYears(data);
      } else {
        setError(api.error || "Erro ao buscar anos");
      }
      setLoading(false);
    },
    [api]
  );

  const fetchPrice = useCallback(
    async (brandId: string, modelId: string, yearId: string) => {
      setLoading(true);
      setError(null);
      const data = await api.get<FipePrice>(
        `/fipe/brands/${brandId}/models/${modelId}/years/${yearId}`,
        false
      );
      if (data) {
        return data;
      } else {
        setError(api.error || "Erro ao buscar preço");
        return null;
      }
    },
    [api]
  );

  return {
    brands,
    models,
    years,
    loading,
    error,
    fetchBrands,
    fetchModels,
    fetchYears,
    fetchPrice,
  };
}
