"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function LoadingCards() {
  const cards = [
    {
      color: "from-blue-500/10 to-blue-600/5",
      borderColor: "border-blue-500/20",
      iconBg: "bg-blue-500/10",
    },
    {
      color: "from-emerald-500/10 to-emerald-600/5",
      borderColor: "border-emerald-500/20",
      iconBg: "bg-emerald-500/10",
    },
    {
      color: "from-amber-500/10 to-amber-600/5",
      borderColor: "border-amber-500/20",
      iconBg: "bg-amber-500/10",
    },
  ];

  return (
    <motion.div
      className="w-full space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={cardVariants}>
        <div className="h-9 w-72 mx-auto bg-muted rounded-lg shimmer" />
        <div className="h-4 w-36 mx-auto mt-2 bg-muted rounded shimmer" />
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card className={cn("overflow-hidden", card.borderColor)}>
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50",
                  card.color
                )}
              />
              <CardHeader className="relative pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-8 h-8 rounded-lg shimmer", card.iconBg)} />
                  <div className="h-5 w-24 bg-muted rounded shimmer" />
                </div>
              </CardHeader>
              <CardContent className="relative space-y-2.5">
                <div className="h-5 w-full bg-muted rounded shimmer" />
                <div className="h-5 w-5/6 bg-muted rounded shimmer" />
                <div className="h-5 w-4/6 bg-muted rounded shimmer" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quiz Card Loading */}
      <motion.div variants={cardVariants}>
        <Card className="border-violet-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-violet-600/5 opacity-50" />
          <CardHeader className="relative pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 shimmer" />
              <div className="h-5 w-28 bg-muted rounded shimmer" />
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="h-5 w-3/4 bg-muted rounded shimmer" />
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-14 bg-muted rounded-lg shimmer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
