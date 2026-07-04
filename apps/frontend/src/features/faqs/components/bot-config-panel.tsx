"use client";

import { useState, useEffect } from "react";
import { useBotConfig, useUpdateBotConfig } from "../hooks/use-faqs";
import { LoadingState } from "@/shared/components/loading-state";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export function BotConfigPanel() {
  const { data: config, isLoading } = useBotConfig();
  const updateMutation = useUpdateBotConfig();

  const [form, setForm] = useState({
    botName: "",
    welcomeMessage: "",
    disclaimer: "",
    fallbackMessage: "",
    similarityThreshold: 0.75,
    mode: "FAQ_ONLY",
    modelProvider: "huggingface",
    maxTokens: 150,
    temperature: 0.2,
    isActive: true,
  });

  useEffect(() => {
    if (config) {
      setForm({
        botName: config.botName,
        welcomeMessage: config.welcomeMessage,
        disclaimer: config.disclaimer,
        fallbackMessage: config.fallbackMessage,
        similarityThreshold: config.similarityThreshold,
        mode: config.mode,
        modelProvider: config.modelProvider,
        maxTokens: config.maxTokens,
        temperature: config.temperature,
        isActive: config.isActive,
      });
    }
  }, [config]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(form);
    toast.success("Configuración guardada correctamente");
  };

  if (isLoading) return <LoadingState />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        {/* Mode */}
        <div>
          <label className="block mb-1 font-medium">Modo del chatbot</label>
          <select
            value={form.mode}
            onChange={(e) => handleChange("mode", e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="FAQ_ONLY">Solo FAQ (sin IA)</option>
            <option value="FAQ_PLUS_AI">FAQ + IA generativa</option>
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            FAQ_ONLY responde solo con coincidencias de FAQs. FAQ_PLUS_AI usa IA cuando no hay coincidencia exacta.
          </p>
        </div>

        {/* Bot name */}
        <div>
          <label className="block mb-1 font-medium">Nombre del bot</label>
          <input
            value={form.botName}
            onChange={(e) => handleChange("botName", e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Welcome message */}
        <div>
          <label className="block mb-1 font-medium">Mensaje de bienvenida</label>
          <textarea
            value={form.welcomeMessage}
            onChange={(e) => handleChange("welcomeMessage", e.target.value)}
            className="w-full border rounded-md p-2"
            rows={3}
          />
        </div>

        {/* Fallback message */}
        <div>
          <label className="block mb-1 font-medium">Mensaje de fallback</label>
          <textarea
            value={form.fallbackMessage}
            onChange={(e) => handleChange("fallbackMessage", e.target.value)}
            className="w-full border rounded-md p-2"
            rows={3}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Se muestra cuando el bot no encuentra respuesta.
          </p>
        </div>

        {/* Disclaimer */}
        <div>
          <label className="block mb-1 font-medium">Disclaimer</label>
          <textarea
            value={form.disclaimer}
            onChange={(e) => handleChange("disclaimer", e.target.value)}
            className="w-full border rounded-md p-2"
            rows={3}
          />
        </div>

        {/* Threshold */}
        <div>
          <label className="block mb-1 font-medium">
            Umbral de similitud ({form.similarityThreshold})
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={form.similarityThreshold}
            onChange={(e) => handleChange("similarityThreshold", parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 (más resultados)</span>
            <span>1 (más preciso)</span>
          </div>
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
            className="size-4"
          />
          <label htmlFor="isActive" className="font-medium">Chatbot activo</label>
        </div>

        {/* AI-only fields */}
        {form.mode === "FAQ_PLUS_AI" && (
          <div className="border rounded-md p-4 space-y-4 bg-muted/30">
            <h3 className="font-medium text-sm">Configuración de IA</h3>

            <div>
              <label className="block mb-1">Modelo</label>
              <input
                value={form.modelProvider}
                onChange={(e) => handleChange("modelProvider", e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Max tokens ({form.maxTokens})</label>
              <input
                type="number"
                min={50}
                max={500}
                value={form.maxTokens}
                onChange={(e) => handleChange("maxTokens", parseInt(e.target.value))}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div>
              <label className="block mb-1">
                Temperatura ({form.temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={form.temperature}
                onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
      >
        {updateMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        Guardar configuración
      </button>
    </form>
  );
}
