import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getInitials from "@/lib/utils";
import { CommentDetails } from "@/types/api.types";
import { formatRelative } from "date-fns";

export default function CommentCard({ comment }: { comment: CommentDetails }) {
  return (
    <div className="px-5 py-3 space-y-2 rounded-lg border flex gap-x-4 items-center border-brand-border bg-[#F8F8F8]">
      <Avatar className="h-14 w-14">
        <AvatarImage src={"/"} alt="@shadcn" />
        <AvatarFallback className="bg-[#E4E6E7] text-xl text-primary">
          {getInitials(comment?.author?.name ?? comment?.author?.email)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-brand-fade p-0 m-0 capitalize">
          {comment?.author?.name ?? comment?.author?.email}
          <span className="text-xs capitalize! pl-2">
            {formatRelative(comment?.created_at, new Date())}
          </span>
        </p>
        <p className="text-sm text-brand-fade p-0 m-0 pt-1 font-medium text-primary">
          {comment?.content}
        </p>
      </div>
    </div>
  );
}
