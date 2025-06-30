import { Button } from "@/components/ui/button";
import PersonAvatar from "@/components/ui/person-avatar";
import useDisclosure from "@/hooks/use-disclosure";
import { NoteDetails } from "@/types/api.types";
import { formatRelative } from "date-fns";
import { Dot, MessageCircleDashed } from "lucide-react";
import NoteCommentSection from "../../template/note-comment-template";

export default function NoteCard({ note }: { note: NoteDetails }) {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <div className="px-5 py-3 space-y-4 rounded-lg border border-brand-border bg-[#F8F8F8]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <PersonAvatar {...note.author} />
            <p className="text-sm font-bold capitalize">
              {note?.author?.name ?? note?.author?.email}
            </p>
          </div>
          <Dot />
          <p className="text-xs text-brand-fade capitalize">
            {formatRelative(note?.created_at, new Date())}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <p
          className="text-sm text-primary note-details"
          dangerouslySetInnerHTML={{
            __html: note.content,
          }}
        ></p>
        <Button
          size="icon"
          variant="outline"
          className="px-0 py-0 h-fit bg-transparent outline-none shadow-none border-0"
          onClick={onToggle}
        >
          <MessageCircleDashed />
        </Button>
      </div>
      {isOpen && <NoteCommentSection note={note} />}
    </div>
  );
}
