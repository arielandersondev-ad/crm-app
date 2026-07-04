import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class EmbeddingService {
  private pipe: any;
  private readonly logger = new Logger(EmbeddingService.name);

  async generate(text: string): Promise<number[]> {
    try {
      if (!this.pipe) {
        const { pipeline } = await import("@xenova/transformers");
        this.pipe = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
      }
      const result = await this.pipe(text, { pooling: "mean", normalize: true });
      return Array.from(result.data);
    } catch {
      this.pipe = null;
      this.logger.warn("Embedding service not available (onnxruntime missing). Returning zero vector.");
      return new Array(384).fill(0);
    }
  }
}