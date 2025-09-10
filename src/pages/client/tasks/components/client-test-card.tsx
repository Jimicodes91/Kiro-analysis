import { Card, CardContent } from "@/components/ui/card";
import AttachmentCard from "@/pages/Home/project-details/components/cards/attachment";
import { TaskDetails } from "@/types/api.types";
import { format } from "date-fns";

function ClientTaskCard({ task, projectId }: { task: TaskDetails; projectId: string }) {
  return (
    <Card className="bg-[#F3F3F3] border border-[#0000001A] shadow-none">
      <CardContent className="p-5 space-y-3">
        <div className="space-y-0">
          <h2 className="text-lg font-semibold">{task?.name}</h2>
          <p className="text-[#19181980] text-sm">{task?.description}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
            {format(new Date(task?.start_date ?? ""), "MMM d, yyyy")} -{" "}
            {format(new Date(task?.end_date ?? ""), "MMM d, yyyy")}
          </span>
          <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
            Assigned by: {task?.assignees?.map((member) => member?.name).join(", ")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {task?.document?.map(
            (item) =>
              item?.attachments?.map((attachment) => (
                <AttachmentCard
                  projectId={projectId}
                  attachment={attachment}
                  key={attachment.id}
                />
              ))
            //
          )}
        </div>
        {/* <Button variant="outline" size="sm">
              <span>Upload document</span>
            </Button> */}

        {/* <div className="space-x-4">
          <a href="https://www.content.com" className="text-blue-600 underline">
            www.content.com
          </a>
          <a href="https://www.material.com" className="text-blue-600 underline">
            www.material.com
          </a>
        </div> */}
      </CardContent>
    </Card>
  );
}

export default ClientTaskCard;
