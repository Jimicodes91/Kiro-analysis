import Toast from "@/components/Toast";
import { ProjectTypeMilestone } from "@/hooks/project-modules/milestones/use-all-get-project-type-milestones";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";
import { secureRequest } from "@/services/api.service";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

interface PylottMilestonesResponse {
  data: {
    data: ProjectTypeMilestone[];
  };
}

/**
 * Hook that provides auto-close milestone transition logic.
 * When a project status is changed to "completed", this hook fetches the project type's
 * milestones and automatically updates the project's milestone_id to the "Closed"
 * (or final) milestone.
 *
 * Requirements: 1.11, 2.11, 3.2
 */
const useAutoCloseMilestone = (projectId: string, projectTypeId: string) => {
  const queryClient = useQueryClient();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerAutoClose = useCallback(async () => {
    if (!projectId || !projectTypeId) {
      console.warn(
        "[useAutoCloseMilestone] Missing projectId or projectTypeId, skipping auto-close."
      );
      return;
    }

    setIsTransitioning(true);

    try {
      // Step 1: Fetch milestones for the project type
      const milestonesUrl =
        (import.meta.env.VITE_API_BASE_URL as string) +
        ENDPOINTS.GET_ALL_PROJECT_TYPE_MILESTONES(projectTypeId);

      const response = (await secureRequest({
        url: milestonesUrl,
        method: "get",
      })) as PylottMilestonesResponse;

      const milestones = response?.data?.data;

      if (!milestones || milestones.length === 0) {
        console.warn(
          "[useAutoCloseMilestone] No milestones found for project type:",
          projectTypeId
        );
        setIsTransitioning(false);
        return;
      }

      // Step 2: Find the "Closed" milestone
      // Priority: name.toLowerCase() === "closed", then is_final === true (via is_system),
      // then fallback to the last milestone in the list
      const closedMilestone =
        milestones.find(
          (m) => m.name.toLowerCase() === "closed"
        ) ??
        milestones.find((m) => m.is_system === 1) ??
        milestones[milestones.length - 1];

      if (!closedMilestone) {
        console.warn(
          "[useAutoCloseMilestone] No 'Closed' milestone found for project type:",
          projectTypeId
        );
        setIsTransitioning(false);
        return;
      }

      // Step 3: Update the project's milestone_id to the closed milestone
      const updateUrl =
        (import.meta.env.VITE_API_BASE_URL as string) +
        ENDPOINTS.UPDATE_PROJECT_MILESTONE(projectId);

      await secureRequest({
        url: updateUrl,
        method: "patch",
        body: { milestone_id: closedMilestone.id },
      });

      // Step 4: Invalidate relevant queries so the UI updates
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_ALL_PROJECTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.GET_PROJECT_DETAILS, projectId],
      });

      // Step 5: Notify user of successful transition
      Toast.success("Project moved to Closed milestone");
    } catch (error) {
      console.warn(
        "[useAutoCloseMilestone] Failed to auto-transition milestone:",
        error
      );
      Toast.error("Failed to auto-transition milestone");
    } finally {
      setIsTransitioning(false);
    }
  }, [projectId, projectTypeId, queryClient]);

  return { triggerAutoClose, isTransitioning };
};

export default useAutoCloseMilestone;
