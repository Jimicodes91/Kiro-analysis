import { Badge } from "@/components/ui/badge";
import { getFormattedText } from "@/lib/utils";
import { Calendar } from "lucide-react";

function MilestoneItem({
  title,
  info,
  status,
  statusText,
}: {
  title: string;
  info: string;
  status: "in_progress" | "completed" | "blocked";
  statusText: string;
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between rounded-lg border p-3 bg-[#F3F3F3] border-[#0000001A]">
      <div className="space-y-2">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="size-4 text-[#191919B2]" />
          Duration: {info} days
        </p>
      </div>
      <Badge variant={status}>{getFormattedText(statusText)}</Badge>
    </div>
  );
}
export default MilestoneItem;
