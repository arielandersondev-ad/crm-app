export interface AIProvider {
  generate(question: string, context: string): Promise<string>;
  generateFaqSuggestions(prompt: string): Promise<string>;
}
