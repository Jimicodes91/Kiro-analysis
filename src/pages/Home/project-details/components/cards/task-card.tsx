import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import getInitials from "@/lib/utils";

function TaskCard() {
  return (
    <div className="px-5 py-3 space-y-2 rounded-lg border border-brand-border bg-[#F8F8F8]">
      <div className="flex items-center justify-between">
        <Badge variant="destructive">Over due</Badge>
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
      <div>
        <Heading size="h5">Planning & Strategy</Heading>
        <p className="text-sm text-brand-fade">
          Define relocation objectives, Set budget and timeline, Assign project manager &
          key stakeholders
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm text-brand-fade p-0 m-0 pt-1">
            Due date: <span className="text-primary">12 June 2024</span>
          </p>
        </div>
        <div className="flex -space-x-2">
          {["Johnbosco", "Nene", "Temi"]?.map((member, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center mt-2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm font-medium ring-2 ring-white"
            >
              {getInitials(member)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
