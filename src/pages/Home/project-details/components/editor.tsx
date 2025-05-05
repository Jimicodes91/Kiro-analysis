import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useCreateNote from "@/hooks/project-modules/note/use-create-note";
import { Bold, ListOrdered, Send, Strikethrough } from "lucide-react";
import React from "react";
import { GoListUnordered } from "react-icons/go";
import Editor, {
  ContentEditableEvent,
  createButton,
  Toolbar,
} from "react-simple-wysiwyg";

const BtnBold = createButton(
  "Bold",
  <Button
    size="icon"
    className="h-full w-full rounded-none bg-inherit"
    aria-label="Toggle bold"
  >
    <Bold className="h-4 w-4 text-primary" />
  </Button>,

  "bold"
);

const BtnOrderedList = createButton(
  "Numbered list",
  <Button
    size="icon"
    className="h-full w-full rounded-none bg-inherit"
    aria-label="Ordered list"
  >
    <ListOrdered className="h-4 w-4 text-primary" />
  </Button>,
  "insertOrderedList"
);

const BtnUnOrderedList = createButton(
  "Bullet list",
  <Button
    size="icon"
    className="h-full w-full rounded-none bg-inherit"
    aria-label="Toggle italic"
  >
    <GoListUnordered className="h-4 w-4 text-primary" />
  </Button>,
  "insertUnorderedList"
);

const BtnStrikeThrough = createButton(
  "Strike through",
  <Button
    size="icon"
    className="h-full w-full rounded-none bg-inherit"
    aria-label="Toggle italic"
  >
    <Strikethrough className="h-4 w-4 text-primary" />
  </Button>,
  "strikeThrough"
);

export default function CustomEditor({ projectId }: { projectId: string }) {
  const [html, setHtml] = React.useState("");
  const createNote = useCreateNote(projectId);
  const [isPinned, setIsPinned] = React.useState(false);

  const createNoteHandler = () => {
    createNote
      .mutateAsync({
        content: html,
        mentions: [],
        attachments: [],
        is_pinned: isPinned,
      })
      .then(() => {
        // Reset after send
        setIsPinned(false);
        setHtml("");
      })
      .catch(console.error);
  };

  function onChange(e: ContentEditableEvent) {
    setHtml(e.target.value);
  }
  return (
    <Editor
      value={html}
      onChange={onChange}
      containerProps={{ style: { resize: "vertical", minHeight: "150px" } }}
    >
      <Toolbar style={{ justifyContent: "space-between" }}>
        <div className="p-1 space-x-2">
          <BtnBold />
          <BtnStrikeThrough />
          <BtnOrderedList />
          <BtnUnOrderedList />
        </div>
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
              Make visible to client
            </label>
          </div>

          <Button
            onClick={createNoteHandler}
            size="icon"
            isLoading={createNote.isPending}
          >
            <Send />
          </Button>
        </div>
      </Toolbar>
    </Editor>
  );
}
