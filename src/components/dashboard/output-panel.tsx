"use client";

import { useState } from "react";
import { Check, Copy, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OutputPanelProps {
  output: string;
  isStreaming: boolean;
  error: string | null;
  emptyTitle: string;
  emptyDescription: string;
}

export function OutputPanel({
  output,
  isStreaming,
  error,
  emptyTitle,
  emptyDescription,
}: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard.");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy. Please copy manually.");
    }
  }

  const showEmpty = !output && !isStreaming && !error;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>Output</span>
          {isStreaming ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating...
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!output || isStreaming}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      <div
        className={cn(
          "min-h-[260px] rounded-lg border bg-muted/30 p-5 text-sm leading-relaxed",
          error && "border-destructive/40 bg-destructive/5"
        )}
      >
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : showEmpty ? (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">{emptyTitle}</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
        ) : output ? (
          <FormattedOutput text={output} />
        ) : (
          <StreamingSkeleton />
        )}
      </div>
    </div>
  );
}

function StreamingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Lightweight Markdown-ish renderer that supports:
 *   - "## " headings
 *   - "- " bullet lists
 *   - blank-line separated paragraphs
 * Intentionally minimal: keeps the output panel dependency-free.
 */
function FormattedOutput({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div className="space-y-4 text-foreground">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return (
            <h3
              key={index}
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {block.content}
            </h3>
          );
        }
        if (block.kind === "list") {
          return (
            <ul
              key={index}
              className="list-disc space-y-1 pl-5 text-sm marker:text-muted-foreground"
            >
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap text-sm">
            {block.content}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { kind: "heading"; content: string }
  | { kind: "paragraph"; content: string }
  | { kind: "list"; items: string[] };

function parseBlocks(text: string): Block[] {
  const lines = text.split(/\r?\n/);
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ kind: "paragraph", content: paragraph.join("\n").trim() });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    blocks.push({ kind: "list", items: list });
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", content: line.slice(3).trim() });
      continue;
    }

    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      list.push(bulletMatch[1]);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}
