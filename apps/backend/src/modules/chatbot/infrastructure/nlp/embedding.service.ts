import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmbeddingService {
  private pipe: any;
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(private readonly configService: ConfigService) {}

  async generate(text: string): Promise<number[]> {
    // Intento 1: local @xenova/transformers
    try {
      if (!this.pipe) {
        const { pipeline } = await import("@xenova/transformers");
        this.pipe = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
      }
      const result = await this.pipe(text, { pooling: "mean", normalize: true });
      return Array.from(result.data);
    } catch (localErr) {
      this.pipe = null;
      console.log("[EmbeddingService] Local ONNX falló, intentando HuggingFace API...");
      this.logger.warn("Local embedding failed, trying HuggingFace API...");
    }

    // Intento 2: HuggingFace Inference API
    try {
      const embedding = await this.generateViaApi(text);
      console.log("[EmbeddingService] HuggingFace API exitoso, primeros 5 valores:", embedding.slice(0, 5));
      return embedding;
    } catch (apiErr) {
      this.logger.error("HuggingFace API embedding also failed", apiErr);
    }

    // Fallback final: vector de ceros
    this.logger.warn("Returning zero vector (no embedding service available)");
    return new Array(384).fill(0);
  }

  private async generateViaApi(text: string): Promise<number[]> {
    const apiKey = this.configService.get<string>("HF_TOKEN", "");
    const model = this.configService.get<string>(
      "HF_EMBEDDING_MODEL",
      "sentence-transformers/all-MiniLM-L6-v2",
    );

    console.log(`[EmbeddingService] Llamando a HF API con modelo: ${model}`);

    const res = await fetch(
      `https://router.huggingface.co/hf-inference/models/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          options: { wait_for_model: true },
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`HuggingFace API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    // Feature extraction returns [[0.001, 0.002, ...]]
    return data[0] as number[];
  }
}