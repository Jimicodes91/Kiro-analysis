import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
    useCreateTaskComment,
    useDeleteTaskComment,
    useTaskComments,
} from "@/hooks/project-modules/tasks/use-task-comments";
import { getIsAdmin, getUserSession } from "@/services/api.service";
import { TaskComment } from "@/types/task.types";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskCommentsProps {
  projectId: string; // pass empty string for standalone tasks (hooks auto-switch to standalone endpoints)
  taskId: string;
}

function CommentItem({
  comment,
  projectId,
  taskId,
}: {
  comment: TaskComment;
  projectId: string;
  taskId: string;
}) {
  const user = getUserSession();
  const isAdmin = getIsAdmin();
  const canDelete = comment.author_id === user?.id || isAdmin;
  const deleteComment = useDeleteTaskComment(projectId, taskId, comment.id);

  const handleDelete = () => {
    deleteComment.mutateAsync({}).catch(console.error);
  };

  return (
    <div className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-900">
            {comment.author?.name ?? "Unknown"}
          </span>
          <span className="text-xs text-gray-400">
            {format(new Date(comment.created_at), "MMM d, yyyy h:mm a")}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={deleteComment.isPending}
          className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete comment"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default function TaskComments({ projectId, taskId }: TaskCommentsProps) {
  const [content, setContent] = useState("");
  const comments = useTaskComments(projectId, taskId);
  const createComment = useCreateTaskComment(projectId, taskId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    createComment
      .mutateAsync({ content: trimmed } as never)
      .then(() => setContent(""))
      .catch(console.error);
  };

  const isLoading = createComment.isPending || comments.isRefetching;

  const renderBody = () => {
    if (comments.isPending) {
      return (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (comments.isError) {
      return (
        <div className="py-6 text-center text-sm text-gray-400">
          Failed to load comments
        </div>
      );
    }

    const list = comments.value?.data ?? [];
    if (list.length === 0) {
      return (
        <div className="py-6 text-center text-sm text-gray-400">
          No comments yet
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {list.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            projectId={projectId}
            taskId={taskId}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Comments</h3>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Add a comment…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            className="pr-8"
          />
          {isLoading && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
              <Icons.spinner className="animate-spin" />
            </span>
          )}
        </div>
        <Button type="submit" size="sm" disabled={isLoading || !content.trim()}>
          Add
        </Button>
      </form>

      {renderBody()}
    </div>
  );
}
