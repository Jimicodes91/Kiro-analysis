import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import getInitials from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function UserNav({ onOpen }: { onOpen?: () => void }) {
  const user = getUserSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-1 py-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={"/"} alt="@shadcn" />
            <AvatarFallback className="bg-[#E4E6E7] text-primary">
              {getInitials(user?.name ? user?.name : user?.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60 p-1.5 bg-[#F9F9F9] border-[#0000001A] shadow-none border"
        align="end"
        forceMount
      >
        <div className="bg-[#E5F1E3E5] rounded-sm py-4 flex gap-1 flex-col items-center">
          <Avatar className="h-14 w-14">
            <AvatarImage src={"/"} alt="@shadcn" />
            <AvatarFallback className="bg-[#E4E6E7] text-primary">
              <User />
            </AvatarFallback>
          </Avatar>
          <p>{user?.name}</p>
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile-setting">Profile Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings">Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#0000001A]" />
        <DropdownMenuItem onClick={onOpen}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
