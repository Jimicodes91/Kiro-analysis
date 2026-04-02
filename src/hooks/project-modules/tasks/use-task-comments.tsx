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
  const isStandalone = !projectId;
  const endpoint = isStandalone
    ? ENDPOINTS.GET_STANDALONE_TASK_COMMENTS(taskId)
    : ENDPOINTS.GET_TASK_COMMENTS(projectId, taskId);
  const queryKey = isStandalone
    ? [QUERYKEYS.GET_STANDALONE_TASK_COMMENTS, taskId]
    : [QUERYKEYS.GET_TASK_COMMENTS, projectId, taskId];

  return useQueryActionHook<TaskCommentsResponse>({
    method: "get",
    endpoint,
    queryKey,
    enabled: !!taskId,
  });
};

// ── POST comment ──

export interface CreateTaskCommentRequest {
  content: string;
}

export const useCreateTaskComment = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();
  const isStandalone = !projectId;
  const endpoint = isStandalone
    ? ENDPOINTS.ADD_STANDALONE_TASK_COMMENT(taskId)
    : ENDPOINTS.ADD_TASK_COMMENT(projectId, taskId);
  const queryKey = isStandalone
    ? [QUERYKEYS.GET_STANDALONE_TASK_COMMENTS, taskId]
    : [QUERYKEYS.GET_TASK_COMMENTS, projectId, taskId];

  return useCustomMutation<Record<string, string>, CreateTaskCommentRequest>({
    method: "post",
    endpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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
  const isStandalone = !projectId;
  const endpoint = isStandalone
    ? ENDPOINTS.DELETE_STANDALONE_TASK_COMMENT(taskId, commentId)
    : ENDPOINTS.DELETE_TASK_COMMENT(projectId, taskId, commentId);
  const queryKey = isStandalone
    ? [QUERYKEYS.GET_STANDALONE_TASK_COMMENTS, taskId]
    : [QUERYKEYS.GET_TASK_COMMENTS, projectId, taskId];

  return useCustomMutation({
    method: "delete",
    endpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
