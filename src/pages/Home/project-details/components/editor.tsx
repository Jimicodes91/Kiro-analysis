import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import useCreateNote from "@/hooks/project-modules/note/use-create-note";
import { Bold, Italic, Repeat, Send } from "lucide-react";
import { useState } from "react";

export const NoteEditor = ({ projectId }: { projectId: string }) => {
  const createNote = useCreateNote(projectId);
  const [isPinned, setIsPinned] = useState(false);

  const formatText = (command: "bold" | "italic" | "removeFormat") => {
    document.execCommand(command, false);
  };

  const createNoteHandler = (content: string, isPinned: boolean) => {
    createNote
      .mutateAsync({
        content,
        mentions: [],
        attachments: [],
        is_pinned: isPinned,
      })
      .then(() => {
        // Reset after send
        setIsPinned(false);
        (document.getElementById("editor") as HTMLElement).innerHTML = "";
      })
      .catch(console.error);
  };

  const handleSend = () => {
    const plainText = (document.getElementById("editor") as HTMLElement).innerHTML;
    createNoteHandler(plainText, isPinned);
  };

  return (
    <div className="border-2 border-brand-border rounded-lg p-4 min-h-[110px] flex flex-col justify-between">
      <div
        id="editor"
        aria-disabled={createNote.isPending}
        contentEditable
        contextMenu=""
        className="min-h-[50px] outline-none text-gray-800"
      ></div>

      <div className="flex items-center mt-4">
        {/* Formatting buttons */}
        <div className="flex gap-3">
          <Toggle aria-label="Toggle bold" onClick={() => formatText("bold")}>
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle bold" onClick={() => formatText("italic")}>
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle bold" onClick={() => formatText("removeFormat")}>
            <Repeat className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Checkbox + Send button */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isPinned}
              onCheckedChange={(e) => setIsPinned(e as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark Visible to client
            </label>
          </div>

          <Button onClick={handleSend} size="icon" isLoading={createNote.isPending}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};
