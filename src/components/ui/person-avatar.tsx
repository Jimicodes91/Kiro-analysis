import { Author } from "@/types/api.types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import getInitials from "@/lib/utils";

export default function PersonAvatar({ name, email }: Partial<Author>) {
  return (
    <HoverCard>
      <HoverCardTrigger onClick={(e) => e.stopPropagation()} className="cursor-pointer">
        <Avatar className="h-9 w-9 ring-offset-2 ring-1 ring-white">
          <AvatarImage src={"/"} alt="@shadcn" />
          <AvatarFallback className="bg-[#E4E6E7] text-primary font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={"/"} alt="@shadcn" />
            <AvatarFallback className="bg-[#E4E6E7] text-primary font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-medium">{name}</h4>
            {email && <div className="text-muted-foreground text-xs">{email}</div>}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
