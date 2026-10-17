import { Badge } from "@/components/ui/badge";
import Heading from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import {
    PYLOTT_SUGGESTIONS,
    PylottAnswer,
    answerQuestion,
} from "@/utils/pylott-assistant";
import { ArrowUp, ChevronRight, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePylottData from "./use-pylott-data";

/**
 * Ask Pylott: a simple, rule-based project assistant.
 *
 * It is not an AI model. Questions are matched to a fixed set of topics (tasks,
 * documents, project stage, dates) and answered from the client's own project
 * data. Nothing is sent to a third party, and when Pylott doesn't know, it says
 * so. See `src/utils/pylott-assistant.ts` for the answering logic.
 */

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  answer?: PylottAnswer;
}

const WELCOME: PylottAnswer = {
  text: "Hi, I'm Pylott. Ask me about your tasks, documents or project stage and I'll answer from your project data.",
  suggestions: PYLOTT_SUGGESTIONS,
};

export default function ClientAskPylott() {
  const navigate = useNavigate();
  const { data, isLoading } = usePylottData();

  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "assistant", text: WELCOME.text, answer: WELCOME },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const answer = answerQuestion(trimmed, data);
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", text: trimmed },
      { id: nextId.current++, role: "assistant", text: answer.text, answer },
    ]);
    setInput("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] p-3 sm:p-4 md:p-6 bg-gray-50 page-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <Heading size="h3" className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Ask Pylott
          </Heading>
          <p className="text-[#19181980] text-sm">
            Quick answers about your tasks, documents and project stage.
          </p>
        </div>
        <Badge variant="pending" size="sm">
          Beta
        </Badge>
      </div>

      {/* Conversation */}
      <div
        className="flex-1 w-full max-w-2xl mx-auto py-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Conversation with Pylott"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm space-y-3",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white border border-brand-border text-primary"
              )}
            >
              <p>{message.text}</p>

              {message.answer?.items && (
                <ul className="space-y-2">
                  {message.answer.items.map((item, i) => (
                    <li key={i}>
                      {item.to ? (
                        <button
                          type="button"
                          onClick={() => navigate(item.to as string)}
                          className="w-full flex items-center justify-between gap-2 rounded-lg border border-brand-border bg-[#F8F8F8] px-3 py-2 text-left transition-colors hover:bg-gray-100"
                        >
                          <span>{item.text}</span>
                          <ChevronRight className="size-4 shrink-0 text-brand-fade" />
                        </button>
                      ) : (
                        <span className="block rounded-lg bg-[#F8F8F8] px-3 py-2">
                          {item.text}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {message.answer?.actions && (
                <div className="flex flex-wrap gap-2">
                  {message.answer.actions.map((action) => (
                    <button
                      key={action.to}
                      type="button"
                      onClick={() => navigate(action.to)}
                      className="rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {message.id === lastAssistantId && message.answer?.suggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {message.answer.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => ask(suggestion)}
                      disabled={isLoading}
                      className="rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs text-primary transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl mx-auto">
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 rounded-2xl border border-brand-border bg-white px-4 py-3"
        >
          <label htmlFor="pylott-input" className="sr-only">
            Ask Pylott a question
          </label>
          <input
            id="pylott-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            maxLength={300}
            autoComplete="off"
            placeholder={isLoading ? "Loading your project..." : "Ask about your tasks, documents or stage"}
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-brand-fade outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send question"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowUp className="size-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-brand-fade">
          Pylott is a simple assistant, not an AI. It answers from your project data, and dates are
          estimates.
        </p>
      </div>
    </div>
  );
}
