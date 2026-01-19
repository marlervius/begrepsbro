"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  term: string;
  language: string;
  languageLabel: string;
  result: {
    simpleNorwegian: string;
    nativeTranslation: string;
    analogy: string;
    quiz: {
      question: string;
      options: string[];
      correctAnswer: string;
    };
  };
  timestamp: number;
}

const STORAGE_KEY = "begrepsbroen-history";
const MAX_HISTORY_ITEMS = 10;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryItem[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
    }
  }, [history, isLoaded]);

  const addToHistory = useCallback(
    (
      term: string,
      language: string,
      languageLabel: string,
      result: HistoryItem["result"]
    ) => {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        term: term.trim(),
        language,
        languageLabel,
        result,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        // Remove duplicate if same term + language exists
        const filtered = prev.filter(
          (item) =>
            !(
              item.term.toLowerCase() === term.toLowerCase() &&
              item.language === language
            )
        );

        // Add new item at the beginning and limit to MAX_HISTORY_ITEMS
        return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      });
    },
    []
  );

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getFromHistory = useCallback(
    (id: string): HistoryItem | undefined => {
      return history.find((item) => item.id === id);
    },
    [history]
  );

  return {
    history,
    isLoaded,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getFromHistory,
  };
}
