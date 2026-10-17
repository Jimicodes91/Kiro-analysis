import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { calculateMilestoneDates } from "@/utils/milestone-dates";
import { PylottData, PylottStage } from "@/utils/pylott-assistant";
import { useMemo } from "react";

/**
 * Collects the project facts Pylott is allowed to use, from the same
 * authenticated endpoints the client's other pages already call. Nothing here
 * talks to a third party, and access is whatever those endpoints allow.
 *
 * A source that is still loading or failed to load is reported as `null`
 * ("unavailable"), never as an empty list, so Pylott can't claim "you have no
 * tasks" when the truth is "I couldn't load your tasks".
 */
export default function usePylottData(): {
  data: PylottData;
  isLoading: boolean;
} {
  const { activeProject } = useClientProjectContext();
  const user = getUserSession();
  const projectId = activeProject?.id ?? "";

  const tasksQuery = useGetProjectTasks(projectId, user?.id);
  const docsQuery = useGetAllProjectDocuments(projectId);
  const journeyQuery = useGetProjectTypeDetails(activeProject?.project_type_id ?? "");

  const tasksData = tasksQuery?.value?.data;
  const docsData = docsQuery?.value?.data;
  const milestones = journeyQuery?.value?.data?.milestones;

  const data = useMemo<PylottData>(() => {
    // Find the current stage. If we can't be sure which one it is, report no
    // stage rather than defaulting to the first one.
    const currentId = activeProject?.milestone?.id ?? activeProject?.milestone_id;
    const index =
      milestones && currentId ? milestones.findIndex((m) => m.id === currentId) : -1;

    let stage: PylottStage | null = null;
    let projectEndDate: Date | null = null;

    if (milestones?.length && index !== -1) {
      const dates = calculateMilestoneDates(
        milestones,
        index,
        activeProject?.start_date,
        activeProject?.milestone_start_date
      );
      stage = {
        name: milestones[index].name,
        index,
        total: milestones.length,
        startDate: dates[index]?.startDate ?? null,
        endDate: dates[index]?.endDate ?? null,
      };
      projectEndDate = dates[dates.length - 1]?.endDate ?? null;
    }

    // Visibility is decided by the backend, which already limits what a client
    // can fetch (e.g. only tasks marked visible to and assigned to them). We use
    // exactly what it returns, the same as the Tasks and Documents pages, and
    // do not apply our own visibility rule on top. A second rule here caused
    // Pylott to ignore tasks the Tasks page was showing.
    return {
      projectId,
      tasks: Array.isArray(tasksData) ? tasksData : null,
      documents: Array.isArray(docsData) ? docsData : null,
      stage,
      projectEndDate,
    };
  }, [projectId, tasksData, docsData, milestones, activeProject]);

  return {
    data,
    isLoading:
      Boolean(projectId) &&
      (tasksQuery.isPending || docsQuery.isPending || journeyQuery.isPending),
  };
}
