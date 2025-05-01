import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import getInitials from "@/lib/utils";
import { NoteDetails } from "@/types/api.types";
import { formatRelative } from "date-fns";
import { MessageCircleDashed } from "lucide-react";

export default function NoteCard({ note }: { note: NoteDetails }) {
  return (
    <div className="px-5 py-3 space-y-4 rounded-lg border border-brand-border bg-[#F8F8F8]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="inline-flex items-center justify-center mt-2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white">
            {getInitials(note?.author?.email)}
          </div>
          <p className="text-sm pt-1 text-brand-fade capitalize">
            {formatRelative(note?.created_at, new Date())}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icons.more />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Mark as done</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between">
        <p
          className="text-sm text-primary"
          dangerouslySetInnerHTML={{
            __html: note.content,
          }}
        ></p>
        <Button
          size="sm"
          variant="outline"
          className="px-0 py-0 h-fit bg-transparent outline-none shadow-none border-0"
          leftIcon={<MessageCircleDashed />}
        >
          0
        </Button>
      </div>
    </div>
  );
}
