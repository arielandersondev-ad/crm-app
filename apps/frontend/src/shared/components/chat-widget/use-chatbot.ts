"use client";

import axios from "axios";
import { useState, useCallback, useRef } from "react";
import { chatbotService, ChatbotQueryResponse } from "./chatbot.service";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function useChatbot(mode: "landing" | "crm" = "crm", tenantSlug?: string, welcomeMessage?: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: welcomeMessage ?? "¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const idCounter = useRef(1);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        id: `msg-${idCounter.current++}`,
        text,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        if (mode === "landing" && !tenantSlug) {
          const errorMsg: Message = {
            id: `msg-${idCounter.current++}`,
            text: "⚠️ El asistente virtual no está configurado. Contacte al administrador.",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMsg]);
          return;
        }

        let res: ChatbotQueryResponse;
        if (tenantSlug) {
          res = await chatbotService.publicQuery(text, tenantSlug);
        } else {
          res = await chatbotService.query(text);
        }

        const botMsg: Message = {
          id: `msg-${idCounter.current++}`,
          text: res.answer,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (error) {
        const unavailable = axios.isAxiosError(error) && !error.response;
        const tenantNotFound =
          mode === "landing" &&
          axios.isAxiosError(error) &&
          error.response?.status === 404;
        const errorMsg: Message = {
          id: `msg-${idCounter.current++}`,
          text: tenantNotFound
            ? "⚠️ El asistente no está configurado para esta clínica. Contacte al administrador."
            : unavailable
              ? "No se pudo conectar con el asistente. Intenta nuevamente más tarde."
              : "Lo siento, ocurrió un error. Intenta de nuevo más tarde.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, mode, tenantSlug]
  );

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return { messages, isLoading, isOpen, sendMessage, toggleOpen, setIsOpen };
}
