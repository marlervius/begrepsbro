"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Globe, Lightbulb, HelpCircle, Check, X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ResultCardsProps {
  simpleNorwegian: string;
  nativeTranslation: string;
  analogy: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  term: string;
  language: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1,
    },
  },
};

const quizOptionVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: { scale: 0.98 },
};

export function ResultCards({
  simpleNorwegian,
  nativeTranslation,
  analogy,
  quiz,
  term,
  language,
}: ResultCardsProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleAnswerClick = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === quiz.correctAnswer;

  return (
    <motion.div
      className="w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center" variants={cardVariants}>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Resultater for «{term}»
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Oversatt til {language}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Forklaring Card */}
        <motion.div variants={cardVariants}>
          <Card className="h-full overflow-hidden border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 opacity-50" />
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
                  <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                </div>
                <span>Forklaring</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-base leading-relaxed text-foreground/90">
                {simpleNorwegian}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Oversettelse Card - With Blur/Reveal */}
        <motion.div variants={cardVariants}>
          <Card className="h-full overflow-hidden border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 opacity-50" />
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-base">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10">
                    <Globe className="h-4.5 w-4.5 text-emerald-600" />
                  </div>
                  <span>Oversettelse ({language})</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <div className="relative min-h-[60px]">
                <motion.p
                  className="text-base leading-relaxed text-foreground/90"
                  initial={false}
                  animate={{
                    filter: showTranslation ? "blur(0px)" : "blur(8px)",
                    opacity: showTranslation ? 1 : 0.7,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  style={{
                    userSelect: showTranslation ? "auto" : "none",
                  }}
                >
                  {nativeTranslation}
                </motion.p>
                <AnimatePresence>
                  {!showTranslation && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowTranslation(true)}
                        className="gap-2 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <Eye className="h-4 w-4" />
                        Vis oversettelse
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {showTranslation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTranslation(false)}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      Skjul
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {!showTranslation && (
                  <motion.p
                    className="text-xs text-muted-foreground text-center pt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    💡 Prøv å forstå det norske først!
                  </motion.p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analogi Card */}
        <motion.div variants={cardVariants}>
          <Card className="h-full overflow-hidden border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5 opacity-50" />
            <CardHeader className="relative pb-3">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
                  <Lightbulb className="h-4.5 w-4.5 text-amber-600" />
                </div>
                <span>Analogi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-base leading-relaxed text-foreground/90">
                {analogy}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quiz Card - Full Width */}
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-violet-600/5 opacity-50" />
          <CardHeader className="relative pb-3">
            <CardTitle className="flex items-center gap-2.5 text-base">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/10">
                <HelpCircle className="h-4.5 w-4.5 text-violet-600" />
              </div>
              <span>Test deg selv</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <p className="text-base font-medium text-foreground">
              {quiz.question}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {quiz.options.map((option, index) => (
                <motion.div
                  key={option}
                  variants={quizOptionVariants}
                  initial="initial"
                  whileHover={!showResult ? "hover" : undefined}
                  whileTap={!showResult ? "tap" : undefined}
                >
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-auto py-4 px-4 text-left justify-start whitespace-normal text-base",
                      "transition-colors duration-200",
                      showResult &&
                        option === quiz.correctAnswer &&
                        "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                      showResult &&
                        selectedAnswer === option &&
                        option !== quiz.correctAnswer &&
                        "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
                      !showResult &&
                        "hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
                    )}
                    onClick={() => handleAnswerClick(option)}
                    disabled={showResult}
                  >
                    <span className="flex items-center gap-2">
                      {showResult && option === quiz.correctAnswer && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        </motion.span>
                      )}
                      {showResult &&
                        selectedAnswer === option &&
                        option !== quiz.correctAnswer && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          >
                            <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                          </motion.span>
                        )}
                      <span>{option}</span>
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className={cn(
                    "p-4 rounded-xl text-base overflow-hidden",
                    isCorrect
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                  )}
                >
                  {isCorrect
                    ? "🎉 Riktig! Godt jobbet!"
                    : `Ikke helt riktig. Det riktige svaret er: "${quiz.correctAnswer}"`}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
