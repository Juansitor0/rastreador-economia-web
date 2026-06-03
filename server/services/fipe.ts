import axios from "axios";

const FIPE_API_BASE = "https://fipe.parallelum.com.br/api/v2/motorcycles";

interface FipeCache {
  [key: string]: any;
  timestamp: number;
}

class FipeService {
  private cache: Map<string, FipeCache> = new Map();
  private CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  private getCacheKey(endpoint: string): string {
    return endpoint;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getBrands(): Promise<any[]> {
    const cacheKey = this.getCacheKey("brands");
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${FIPE_API_BASE}/brands`);
      const data = response.data;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Error fetching FIPE brands:", error);
      throw new Error("Erro ao buscar marcas de motos");
    }
  }

  async getModels(brandId: string): Promise<any[]> {
    const cacheKey = this.getCacheKey(`models-${brandId}`);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(
        `${FIPE_API_BASE}/brands/${brandId}/models`
      );
      const data = response.data;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Error fetching FIPE models:", error);
      throw new Error("Erro ao buscar modelos de motos");
    }
  }

  async getYears(brandId: string, modelId: string): Promise<any[]> {
    const cacheKey = this.getCacheKey(`years-${brandId}-${modelId}`);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(
        `${FIPE_API_BASE}/brands/${brandId}/models/${modelId}/years`
      );
      const data = response.data;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Error fetching FIPE years:", error);
      throw new Error("Erro ao buscar anos de motos");
    }
  }

  async getPrice(
    brandId: string,
    modelId: string,
    yearId: string
  ): Promise<any> {
    const cacheKey = this.getCacheKey(`price-${brandId}-${modelId}-${yearId}`);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(
        `${FIPE_API_BASE}/brands/${brandId}/models/${modelId}/years/${yearId}`
      );
      const data = response.data;

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Error fetching FIPE price:", error);
      throw new Error("Erro ao buscar preço da moto");
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const fipeService = new FipeService();
