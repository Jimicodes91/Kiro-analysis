import { Badge } from "@/components/ui/badge";
import Heading from "@/components/ui/heading";
import { ArrowUp, FileText, Flag, ListChecks, Sparkles } from "lucide-react";

/**
 * Ask Pylott — visual placeholder.
 *
 * This is intentionally a non-functional mockup (per the UX reference: "confirm
 * whether it is functional or only a visual mockup"). It establishes the chat
 * surface and the assistant's identity without implementing any AI, data access
 * or PII handling — that functional work is a separate effort. The input is
 * disabled and clearly labelled "coming soon" so no one mistakes it for a
 * working assistant.
 */

const SUGGESTIONS: { icon: React.ReactNode; text: string }[] = [
  {
    icon: <ListChecks className="size-4 text-primary" />,
    text: "What do I need to do next on my project?",
  },
  {
    icon: <Flag className="size-4 text-primary" />,
    text: "When is my project estimated to complete?",
  },
  {
    icon: <FileText className="size-4 text-primary" />,
    text: "Which documents are still outstanding?",
  },
];

export default function ClientAskPylott() {
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
            Your project assistant. Ask about tasks, documents and milestones.
          </p>
        </div>
        <Badge variant="pending" size="sm">
          Coming soon
        </Badge>
      </div>

      {/* Intro + suggestions (centered) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-10">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="size-7 text-primary" />
        </div>

        <div className="max-w-md space-y-2">
          <p className="text-lg font-semibold text-primary">
            Hi — I&apos;m Pylott, your project assistant.
          </p>
          <p className="text-sm text-muted-foreground">
            Soon you&apos;ll be able to ask me about your project in plain
            language and get instant answers. For now, here&apos;s a preview of
            what you&apos;ll be able to ask.
          </p>
        </div>

        <div className="w-full max-w-md space-y-2">
          {SUGGESTIONS.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 text-left opacity-80"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                {s.icon}
              </span>
              <span className="text-sm text-primary">{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disabled chat input (visual only) */}
      <div className="w-full max-w-2xl mx-auto">
        <div
          className="flex items-center gap-2 rounded-2xl border border-brand-border bg-white px-4 py-3"
          aria-disabled="true"
        >
          <input
            type="text"
            disabled
            placeholder="Ask Pylott anything… (coming soon)"
            className="flex-1 bg-transparent text-sm text-primary placeholder:text-brand-fade outline-none disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            aria-label="Send message (coming soon)"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/30 text-white cursor-not-allowed"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-brand-fade">
          Ask Pylott is a preview. It isn&apos;t available to chat with yet.
        </p>
      </div>
    </div>
  );
}
