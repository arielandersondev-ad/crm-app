export interface ChatResponse {
  answer: string;
  source: "FAQ" | "AI" | "Fallback";
  confidence: number;
}
