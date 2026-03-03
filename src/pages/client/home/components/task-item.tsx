import { Badge } from "@/components/ui/badge";
import { getFormattedText } from "@/lib/utils";

function TaskItem({
  title,
  due,
  status,
}: {
  title: string;
  due: string;
  status: "in_progress" | "completed" | "pending";
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between rounded-lg border p-3 bg-[#F3F3F3] border-[#0000001A]">
      <div className="space-y-2">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{due}</p>
      </div>
      <Badge variant={status}>{getFormattedText(status)}</Badge>
    </div>
  );
}

export default TaskItem;
