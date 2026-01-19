"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResultCards } from "@/components/result-cards";
import { LoadingCards } from "@/components/loading-cards";
import { RecentSearches } from "@/components/recent-searches";
import { useHistory, HistoryItem } from "@/hooks/useHistory";
import { Sparkles, ArrowRight } from "lucide-react";

const languages = [
  { value: "arabic", label: "العربية (Arabisk)", flag: "🇸🇦" },
  { value: "somali", label: "Soomaali (Somalisk)", flag: "🇸🇴" },
  { value: "polish", label: "Polski (Polsk)", flag: "🇵🇱" },
  { value: "tigrinya", label: "ትግርኛ (Tigrinja)", flag: "🇪🇷" },
  { value: "english", label: "English (Engelsk)", flag: "🇬🇧" },
  { value: "ukrainian", label: "Українська (Ukrainsk)", flag: "🇺🇦" },
  { value: "spanish", label: "Español (Spansk)", flag: "🇪🇸" },
  { value: "vietnamese", label: "Tiếng Việt (Vietnamesisk)", flag: "🇻🇳" },
];

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ResultData {
  simpleNorwegian: string;
  nativeTranslation: string;
  analogy: string;
  quiz: QuizData;
}

export default function Home() {
  const [language, setLanguage] = useState("");
  const [term, setTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguageLabel, setActiveLanguageLabel] = useState("");

  const {
    history,
    isLoaded,
    addToHistory,
    removeFromHistory,
    clearHistory,
  } = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language || !term.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const selectedLanguage = languages.find((l) => l.value === language);
    const languageLabel = selectedLanguage?.label.split(" ")[0] || language;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: term.trim(),
          language: languageLabel,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data: ResultData = await response.json();
      setResult(data);
      setActiveLanguageLabel(languageLabel);

      // Save to history
      addToHistory(term.trim(), language, languageLabel, data);
    } catch (err) {
      setError("Noe gikk galt. Vennligst prøv igjen.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    // Populate form
    setTerm(item.term);
    setLanguage(item.language);

    // Immediately show result from cache (no API call)
    setResult(item.result);
    setActiveLanguageLabel(item.languageLabel);
    setError(null);
  };

  const selectedLanguage = languages.find((l) => l.value === language);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-950/30" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <main className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Lær akademiske begreper</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
            Begrepsbroen
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Din bro til forståelse av norske akademiske begreper.
            <br className="hidden sm:block" />
            Få definisjoner, oversettelser og analogier på ditt språk.
          </p>
        </header>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-6 md:p-8 shadow-lg shadow-black/5">
            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="language"
                  className="text-sm font-medium text-foreground"
                >
                  Velg morsmål
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-full bg-background">
                    <SelectValue placeholder="Velg ditt språk..." />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="term"
                  className="text-sm font-medium text-foreground"
                >
                  Norsk akademisk begrep
                </label>
                <Input
                  id="term"
                  type="text"
                  placeholder="f.eks. demokrati, bærekraft, hypotese..."
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="bg-background"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!language || !term.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Genererer...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Forklar begrepet
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Recent Searches */}
        {isLoaded && history.length > 0 && (
          <div className="max-w-2xl mx-auto mb-12 md:mb-16">
            <RecentSearches
              history={history}
              onSelect={handleHistorySelect}
              onRemove={removeFromHistory}
              onClear={clearHistory}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 text-sm text-center">
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <LoadingCards />
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <ResultCards
              simpleNorwegian={result.simpleNorwegian}
              nativeTranslation={result.nativeTranslation}
              analogy={result.analogy}
              quiz={result.quiz}
              term={term}
              language={activeLanguageLabel || selectedLanguage?.label.split(" ")[0] || language}
            />
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && !error && (
          <div className="text-center text-muted-foreground py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <p className="text-lg">
              Velg et språk og skriv inn et begrep for å komme i gang
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Begrepsbroen – Hjelper deg å forstå akademiske begreper på ditt språk
          </p>
        </div>
      </footer>
    </div>
  );
}
