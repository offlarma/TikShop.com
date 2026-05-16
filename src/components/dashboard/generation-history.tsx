"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  RotateCw,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  deleteGenerationAction,
  setFavoriteAction,
} from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { Generation, Tool } from "@/types/db";

interface GenerationHistoryProps<Input> {
  tool: Tool;
  items: Generation[];
  onItemsChange: (next: Generation[]) => void;
  onRerun: (input: Input) => void;
  inputSummary: (input: Input) => string;
}

export function GenerationHistory<Input>({
  tool,
  items,
  onItemsChange,
  onRerun,
  inputSummary,
}: GenerationHistoryProps<Input>) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleToggleFavorite(item: Generation) {
    const previous = items;
    const optimistic = items.map((g) =>
      g.id === item.id ? { ...g, is_favorite: !g.is_favorite } : g
    );
    onItemsChange(sortByFavorites(optimistic));
    setPendingId(item.id);
    startTransition(async () => {
      const result = await setFavoriteAction(item.id, !item.is_favorite, tool);
      setPendingId(null);
      if (!result.ok) {
        onItemsChange(previous);
        toast.error(result.error);
      }
    });
  }

  function handleDelete(item: Generation) {
    const previous = items;
    const optimistic = items.filter((g) => g.id !== item.id);
    onItemsChange(optimistic);
    if (expandedId === item.id) setExpandedId(null);
    setPendingId(item.id);
    startTransition(async () => {
      const result = await deleteGenerationAction(item.id, tool);
      setPendingId(null);
      if (!result.ok) {
        onItemsChange(previous);
        toast.error(result.error);
      } else {
        toast.success("Generation deleted.");
      }
    });
  }

  function handleRerun(item: Generation) {
    onRerun(item.input as Input);
    toast.message("Loaded previous inputs. Click Generate to re-run.");
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent generations</CardTitle>
          <CardDescription>
            Your saved outputs will appear here. Generate something to start
            building your library.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent generations</CardTitle>
        <CardDescription>
          {items.length} {items.length === 1 ? "entry" : "entries"} · favorites
          pinned to top
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;
          const isPending = pendingId === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border bg-background transition-colors",
                item.is_favorite && "border-amber-400/60 bg-amber-50/40",
                isExpanded && "shadow-sm"
              )}
            >
              <div className="flex flex-wrap items-start gap-3 p-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="line-clamp-1 text-sm font-medium">
                    {inputSummary(item.input as Input) || "Untitled generation"}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatRelative(item.created_at)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(item)}
                    disabled={isPending}
                    aria-label={
                      item.is_favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        item.is_favorite && "fill-amber-400 text-amber-500"
                      )}
                    />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRerun(item)}
                    aria-label="Re-run with the same inputs"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    disabled={isPending}
                    aria-label="Delete generation"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Hide output" : "Show output"}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        View
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {isExpanded ? (
                <div className="border-t bg-muted/30 px-4 py-3">
                  <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-foreground">
                    {item.output}
                  </pre>
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function sortByFavorites(items: Generation[]): Generation[] {
  return [...items].sort((a, b) => {
    if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.round((now - then) / 1000));
  if (diffSec < 60) return "Just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
