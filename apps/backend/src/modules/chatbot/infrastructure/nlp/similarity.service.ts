import { Injectable } from "@nestjs/common";

@Injectable()
export class SimilarityService {
  cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  rank(embedding: number[], embeddings: { index: number; vector: number[] }[]) {
    return embeddings
      .map((e) => ({ index: e.index, score: this.cosineSimilarity(embedding, e.vector) }))
      .sort((a, b) => b.score - a.score);
  }
}