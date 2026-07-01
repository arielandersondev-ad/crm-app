import { Injectable } from "@nestjs/common";

@Injectable()
export class EmbeddingService {
  private pipe: any;

  async generate(text: string): Promise<number[]> {
    if (!this.pipe) {
      const { pipeline } = await import("@xenova/transformers");
      this.pipe = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    const result = await this.pipe(text, { pooling: "mean", normalize: true });
    return Array.from(result.data);
  }
}