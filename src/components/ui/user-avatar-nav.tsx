"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import getInitials from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { Link } from "react-router-dom";

export function UserNav({ onOpen }: { onOpen?: () => void }) {
  const user = getUserSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-0" rightIcon={<Icons.caret />}>
          <Avatar className="h-8 w-8 bg-primary text-white">
            <AvatarImage src={"/"} alt="@shadcn" />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          {/* <div className="flex flex-col text-left">
            <span className="max-w-[120px] whitespace-nowrap text-ellipsis overflow-hidden">
              {user?.value?.data?.[0]?.name}
            </span>
            <span className="max-w-[120px] whitespace-nowrap text-ellipsis overflow-hidden">
              {user?.value?.data?.[0]?.email}
            </span>
          </div> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpen}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
