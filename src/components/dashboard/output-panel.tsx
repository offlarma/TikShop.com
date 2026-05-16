"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  /** Used as the suggested filename for the "Export .txt" button. */
  exportName?: string;
}

export function OutputPanel({
  output,
  isStreaming,
  error,
  emptyTitle,
  emptyDescription,
  exportName = "growth-suite-output",
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

  function handleExport() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = exportName.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
    a.download = `${safeName}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!output || isStreaming}
          >
            <Download className="h-4 w-4" />
            Export .txt
          </Button>
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
          <MarkdownOutput text={output} />
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

function MarkdownOutput({ text }: { text: string }) {
  return (
    <div className="prose-output text-sm text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-4 text-base font-semibold first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground first:mt-0">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-3 text-sm font-semibold">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="my-2 whitespace-pre-wrap leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-2 list-disc space-y-1 pl-5 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-2 hover:text-primary"
            >
              {children}
            </a>
          ),
          code: ({ children, ...props }) => (
            <code
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
              {...props}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto rounded-md border bg-muted p-3 text-xs leading-relaxed">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-border" />,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-2 py-1 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-2 py-1 align-top">
              {children}
            </td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
