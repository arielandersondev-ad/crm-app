import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AIProvider } from "../../domain/interfaces/ai-provider.interface";

@Injectable()
export class HuggingFaceService implements AIProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeout: number;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("HF_TOKEN") ?? "";
    this.model = this.configService.get<string>("HF_MODEL", "Qwen/Qwen2.5-3B-Instruct");
    this.timeout = this.configService.get<number>("HF_TIMEOUT", 10000);
  }

  async generate(question: string, context: string): Promise<string> {
    const systemPrompt = `Eres un asistente administrativo de una clínica oftalmológica.
Responde únicamente utilizando la información proporcionada.
No inventes información.
No realices diagnósticos médicos.
No recomiendes tratamientos.
Si el contexto no contiene la respuesta, responde exactamente:
"No cuento con información suficiente. Comuníquese con recepción."`;

    const prompt = `${systemPrompt}\n\nContexto:\n${context}\n\nPregunta: ${question}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 150, temperature: 0.2 },
          }),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        throw new Error(`HuggingFace API error: ${res.status}`);
      }

      const data = await res.json();
      const text = data[0]?.generated_text ?? "";
      const answer = text.replace(prompt, "").trim();
      return answer || "No cuento con información suficiente. Comuníquese con recepción.";
    } catch (err: any) {
      if (err.name === "AbortError") {
        return "El servicio de IA está temporalmente no disponible. Comuníquese con recepción.";
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
