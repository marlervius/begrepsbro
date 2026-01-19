"use client";

import { HistoryItem } from "@/hooks/useHistory";
import { Button } from "@/components/ui/button";
import { X, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentSearchesProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function RecentSearches({
  history,
  onSelect,
  onRemove,
  onClear,
}: RecentSearchesProps) {
  if (history.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Nettopp";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min siden`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} t siden`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} d siden`;
    return new Date(timestamp).toLocaleDateString("no-NO", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Nylige søk</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Tøm
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5",
              "bg-muted/60 hover:bg-muted rounded-full",
              "border border-transparent hover:border-border",
              "transition-all duration-200 cursor-pointer"
            )}
            onClick={() => onSelect(item)}
          >
            <span className="text-sm font-medium text-foreground">
              {item.term}
            </span>
            <span className="text-xs text-muted-foreground">
              · {item.languageLabel}
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground/60">
              · {formatTimeAgo(item.timestamp)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className={cn(
                "ml-0.5 p-1 rounded-full",
                "opacity-0 group-hover:opacity-100",
                "hover:bg-destructive/10 hover:text-destructive",
                "transition-all duration-150"
              )}
              aria-label={`Fjern "${item.term}" fra historikk`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
