import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import getInitials from "@/lib/utils";
import { Trail } from "@/types/api.types";
import { formatRelative } from "date-fns";

export default function ActivityCard({ activity }: { activity: Trail }) {
  return (
    <div className="px-5 py-3 space-y-2 rounded-lg border flex gap-x-4 items-center border-brand-border bg-[#F8F8F8]">
      <Avatar className="h-16 w-16">
        <AvatarImage src={"/"} alt="@shadcn" />
        <AvatarFallback className="bg-[#E4E6E7] text-2xl text-primary">
          {getInitials(activity?.author?.name ?? activity?.author?.email)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-brand-fade p-0 m-0 capitalize">
          {formatRelative(activity?.created_at, new Date())}
        </p>
        <p className="text-sm text-brand-fade p-0 m-0 pt-1 font-medium text-primary">
          {activity?.description}
        </p>
      </div>
    </div>
  );
}
