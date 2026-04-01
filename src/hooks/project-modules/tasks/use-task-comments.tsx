import useCustomMutation from "@/hooks/use-mutationaction";
import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { TaskComment } from "@/types/task.types";
import { useQueryClient } from "@tanstack/react-query";

// ── GET comments ──

interface TaskCommentsResponse {
  success: boolean;
  message: string;
  data: TaskComment[];
}

export const useTaskComments = (projectId: string, taskId: string) => {
  return useQueryActionHook<TaskCommentsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_TASK_COMMENTS(projectId, taskId),
    queryKey: [QUERYKEYS.GET_TASK_COMMENTS, projectId, taskId],
    enabled: !!projectId && !!taskId,
  });
};

// ── POST comment ──

export interface CreateTaskCommentRequest {
  content: string;
}

export const useCreateTaskComment = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();
  return useCustomMutation<Record<string, string>, CreateTaskCommentRequest>({
    method: "post",
    endpoint: ENDPOINTS.ADD_TASK_COMMENT(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_TASK_COMMENTS, projectId, taskId],
      });
    },
  });
};

// ── DELETE comment ──

export const useDeleteTaskComment = (
  projectId: string,
  taskId: string,
  commentId: string
) => {
  const queryClient = useQueryClient();
  return useCustomMutation({
    method: "delete",
    endpoint: ENDPOINTS.DELETE_TASK_COMMENT(projectId, taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_TASK_COMMENTS, projectId, taskId],
      });
    },
  });
};
