"use client";

import { useState, useCallback, useRef } from "react";
import { chatbotService, ChatbotQueryResponse } from "./chatbot.service";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function useChatbot(tenantSlug?: string, welcomeMessage?: string) {
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
      } catch {
        const errorMsg: Message = {
          id: `msg-${idCounter.current++}`,
          text: "Lo siento, ocurrió un error. Intenta de nuevo más tarde.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, tenantSlug]
  );

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return { messages, isLoading, isOpen, sendMessage, toggleOpen, setIsOpen };
}
