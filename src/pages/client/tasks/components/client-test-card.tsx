import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFormattedText } from "@/lib/utils";
import { TaskDetails } from "@/types/api.types";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ClientTaskCard({ task, projectId }: { task: TaskDetails; projectId: string }) {
  const navigate = useNavigate();
  const hasRequiredInfo = Array.isArray((task as any).required_information) && (task as any).required_information.length > 0;

  return (
    <Card
      className="bg-[#F3F3F3] border border-[#0000001A] shadow-none cursor-pointer hover:border-gray-300 transition-colors"
      onClick={() => navigate(`/tasks/${projectId}/${task.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">{task?.name || "Untitled Task"}</h2>
              <Badge variant={task.status} className="text-xs">
                {getFormattedText(task.status)}
              </Badge>
            </div>
            {task?.description && (
              <p className="text-[#19181980] text-sm line-clamp-1">{task.description}</p>
            )}
            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
              {task?.end_date && (
                <span className="px-2 py-1 rounded bg-white font-medium text-gray-700">
                  Due: {format(new Date(task.end_date), "MMM d, yyyy")}
                </span>
              )}
              {hasRequiredInfo && (
                <span className="px-2 py-1 rounded bg-white font-medium text-gray-700">
                  {(task as any).required_information.length} items required
                </span>
              )}
              {task?.assignees?.length > 0 && (
                <span className="px-2 py-1 rounded bg-white font-medium text-gray-700">
                  Assigned to: {task.assignees.map((m) => m?.name).join(", ")}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-3" />
        </div>
      </CardContent>
    </Card>
  );
}

export default ClientTaskCard;
