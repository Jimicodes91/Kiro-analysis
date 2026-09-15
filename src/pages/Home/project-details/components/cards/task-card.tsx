import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import PersonAvatar from "@/components/ui/person-avatar";
import useGetTaskDetails from "@/hooks/project-modules/tasks/use-get-task-details";
import useUpdateProjectTask from "@/hooks/project-modules/tasks/use-update-project-task";
import useDisclosure from "@/hooks/use-disclosure";
import { cn, getFormattedText, truncateMiddleWords } from "@/lib/utils";
import TaskClientResponses from "@/pages/Home/Task/task-client-responses";
import TaskComments from "@/pages/Home/Task/task-comments";
import { TaskDetails } from "@/types/api.types";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Download, FileText } from "lucide-react";
import { useState } from "react";
import DeleteTaskModal from "../modal/delete-task-modal";
import EditProjectTaskModal from "../modal/edit-project-task-modal";
import UploadDocumentModal from "../modal/upload-document-modal";

function TaskCard({ task }: { task: TaskDetails }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [showComments, setShowComments] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);

  // The list endpoint doesn't include document/client_responses, so fetch the
  // task detail on demand when the submissions section is expanded.
  const taskDetail = useGetTaskDetails(showSubmissions ? task.project_id : "", showSubmissions ? task.id : "");
  const detail = taskDetail?.value?.data;

  // Documents linked to this task that actually have an uploaded file.
  const providedDocuments = (Array.isArray(detail?.document) ? detail!.document : []).filter(
    (doc) => Array.isArray(doc.attachments) && doc.attachments.length > 0
  );
  const clientResponses = detail?.client_responses ?? [];
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const updateTask = useUpdateProjectTask(task.project_id, task?.id);

  const markTaskAsCompleted = () => {
    updateTask
      .mutateAsync({
        status: "completed",
      })
      .catch(console.error);
  };

  const isRequest = task?.task_type?.name === "Document Request";
  return (
    <>
      <div className="px-5 py-3 space-y-2 rounded-lg border border-brand-border bg-[#F8F8F8]">
        <div className="flex items-center justify-between">
          <Badge variant={task?.status}>{getFormattedText(task?.status)}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" isLoading={updateTask.isPending}>
                <Icons.more className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onEditOpen}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={markTaskAsCompleted}
                  disabled={task.status === "completed"}
                >
                  Mark as completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpen}>Delete</DropdownMenuItem>
                {isRequest && task.status !== "completed" && (
                  <DropdownMenuItem onClick={onUploadOpen}>
                    Upload requested document
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Heading size="h5">{task?.name}</Heading>
          <p className="text-sm text-brand-fade">{task?.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-brand-fade p-0 m-0 pt-1">
              Due date:{" "}
              <span className="text-primary">{task?.due_date ? format(task.due_date, "PPP") : task?.end_date ? format(task.end_date, "PPP") : "Not set"}</span>
            </p>
          </div>
          <div className="flex -space-x-2">
            {task?.assignees?.map((member) => (
              <PersonAvatar
                key={member.name}
                name={member?.name ?? ""}
                email={member?.email}
              />
            ))}
          </div>
        </div>
        {/* Comments toggle */}
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
        >
          {showComments ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Comments
        </button>
        {showComments && (
          <div className="mt-2 border-t pt-3">
            <TaskComments projectId={task.project_id} taskId={task.id} />
          </div>
        )}

        {/* Submitted files & responses toggle */}
        <button
          type="button"
          onClick={() => setShowSubmissions((s) => !s)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
        >
          {showSubmissions ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          Submitted files & responses
        </button>
        {showSubmissions && (
          <div className="mt-2 border-t pt-3 space-y-3">
            {taskDetail.isPending ? (
              <p className="text-xs text-gray-400">Loading…</p>
            ) : (
              <>
                {providedDocuments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">
                      {providedDocuments.length > 1 ? "Provided documents" : "Provided document"}
                    </p>
                    {providedDocuments.map((doc) => (
                      <div key={doc.id} className="space-y-1.5">
                        {doc.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white p-2"
                          >
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              {truncateMiddleWords(att.media_url)}
                            </span>
                            <a
                              className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "shrink-0 gap-1"
                              )}
                              href={att.media_url}
                              download
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {clientResponses.length > 0 && (
                  <TaskClientResponses responses={clientResponses} />
                )}

                {providedDocuments.length === 0 && clientResponses.length === 0 && (
                  <p className="text-xs text-gray-400">No files or responses submitted yet.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isOpen && (
          <DeleteTaskModal
            projectId={task.project_id}
            taskId={task?.id}
            isOpen={isOpen}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isEditOpen && (
          <EditProjectTaskModal
            isOpen={isEditOpen}
            task={task}
            projectId={task.project_id}
            onClose={onEditClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {isUploadOpen && (
          <UploadDocumentModal
            isOpen={isUploadOpen}
            projectId={task.project_id}
            onClose={onUploadClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default TaskCard;
