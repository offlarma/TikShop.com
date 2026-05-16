"use client";

import { useCallback, useRef, useState } from "react";

type GenerateOptions = {
  endpoint: string;
  body: Record<string, unknown>;
};

export function useStreamGeneration() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setOutput("");
    setError(null);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const generate = useCallback(
    async ({ endpoint, body }: GenerateOptions) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      setOutput("");
      setIsStreaming(true);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const contentType = response.headers.get("content-type") ?? "";
          let message = `Request failed with status ${response.status}.`;
          if (contentType.includes("application/json")) {
            try {
              const json = (await response.json()) as { error?: string };
              if (json?.error) message = json.error;
            } catch {
              // Ignore JSON parse errors and use the default message.
            }
          } else {
            try {
              const text = await response.text();
              if (text) message = text;
            } catch {
              // Ignore text read errors.
            }
          }
          throw new Error(message);
        }

        if (!response.body) {
          throw new Error("The server returned an empty response.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          setOutput(buffer);
        }

        buffer += decoder.decode();
        setOutput(buffer);

        // Server returned 200 + an empty stream. This typically means
        // the upstream AI provider rejected the request (invalid API
        // key, exhausted quota, content filter, etc.). The real error
        // lives in the server logs — surface a human-readable hint
        // here so the user doesn't have to dig through the terminal.
        if (!buffer.trim()) {
          throw new Error(
            "The AI service did not return a result. This usually means the OpenAI API key is invalid or out of credit. Check the server logs for details."
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    []
  );

  return { output, isStreaming, error, generate, reset, stop };
}
