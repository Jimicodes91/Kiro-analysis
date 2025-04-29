import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import getInitials from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function TeamMemberCard() {
  return (
    <div className="px-5 py-3 space-y-2 rounded-lg border flex justify-between gap-x-4 items-center border-brand-border bg-[#F8F8F8]">
      <div className="flex gap-2 items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={"/"} alt="@shadcn" />
          <AvatarFallback className="bg-[#E4E6E7] text-xl text-primary">
            {getInitials("Uchenna Okenwa")}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm">Uchenna Okenwa</p>
      </div>

      <p className="text-sm text-brand-fade p-0 m-0">Okenwauche98@gmail.com</p>
      <Button size="icon" variant="ghost">
        <Trash2 />
      </Button>
    </div>
  );
}
