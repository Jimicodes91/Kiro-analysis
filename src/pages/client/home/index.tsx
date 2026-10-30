"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Progress } from "@/components/ui/progress";
import { TaskDisplayBadge } from "@/components/ui/task-display-badge";
import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import useGetProjectTypeDetails from "@/hooks/project-modules/project-types/use-get-project-type-details";
import useGetProjectTasks from "@/hooks/project-modules/tasks/use-get-project-tasks";
import useGetUser from "@/hooks/user/use-get-user";
import { safeFormatDate } from "@/lib/utils";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { buildGreeting } from "@/utils/greeting";
import { calculateMilestoneDates, formatMilestoneDate } from "@/utils/milestone-dates";
import { getTaskDueDate } from "@/utils/task-dates";
import { getDisplayedStatus } from "@/utils/task-display-status";
import {
    CheckCircle2,
    ChevronRight,
    CircleCheckBig,
    FileText,
    Flag,
    TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

/** A single colour-coded stat tile in the attention row. */
function StatCard({
  value,
  label,
  icon,
  tone,
  isLoading,
  to,
}: {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  tone: "primary" | "amber" | "green";
  isLoading?: boolean;
  /** The page this card opens. The whole card is the link. */
  to: string;
}) {
  const toneClass = {
    primary: "bg-primary/5 text-primary",
    amber: "bg-[#FAFAE5] text-[#B78026]",
    green: "bg-[#00AA3B0A] text-[#027A48]",
  }[tone];

  return (
    <Link
      to={to}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <Card className="transition-shadow group-hover:shadow-md group-hover:border-gray-300">
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={`flex size-11 items-center justify-center rounded-xl ${toneClass}`}
          >
            {icon}
          </div>
          <div className="space-y-1">
            {isLoading ? (
              <div className="h-7 w-14 rounded bg-slate-200 animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-primary leading-none">{value}</p>
            )}
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <ChevronRight className="ml-auto size-4 shrink-0 text-brand-fade transition-transform group-hover:translate-x-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ClientHomePage() {
  const navigate = useNavigate();
  const userData = useGetUser();
  const user = getUserSession();
  const { activeProject } = useClientProjectContext();
  const projectId = activeProject?.id ?? "";

  const projectDocs = useGetAllProjectDocuments(projectId);
  const projectTasks = useGetProjectTasks(projectId, user?.id);
  const journey = useGetProjectTypeDetails(activeProject?.project_type_id ?? "");

  const greeting = buildGreeting(
    new Date().getHours(),
    userData?.value?.data?.name
  );

  // ── Tasks: split completed vs. the ones that still need action ──────────────
  const tasks = useMemo(
    () => projectTasks?.value?.data ?? [],
    [projectTasks?.value?.data]
  );
  const outstandingTasks = useMemo(
    () => tasks.filter((t) => t.status !== "completed"),
    [tasks]
  );

  // ── Milestone-based project progress (same calc as ProjectDurationBar) ──────
  const milestones = journey?.value?.data?.milestones;
  const journeyLength = milestones?.length || 1;
  const currentMilestoneIndex =
    milestones?.findIndex((m) => m.id === activeProject?.milestone?.id) ?? 0;
  const safeIndex = currentMilestoneIndex === -1 ? 0 : currentMilestoneIndex;
  const progress = Math.round(((safeIndex + 1) / journeyLength) * 100);

  const milestoneDates = useMemo(() => {
    if (!milestones?.length) return [];
    return calculateMilestoneDates(
      milestones,
      safeIndex,
      activeProject?.start_date,
      (activeProject as any)?.milestone_start_date
    );
  }, [milestones, safeIndex, activeProject]);

  const currentMilestone = milestones?.[safeIndex];
  const currentMilestoneDates = milestoneDates[safeIndex];

  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6 bg-gray-50 page-fade-in">
      {/* Greeting */}
      <div>
        <Heading size="h3">{greeting}</Heading>
        <p className="text-muted-foreground">
          Here&apos;s what needs your attention today.
        </p>
      </div>

      {/* Attention stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="amber"
          icon={<CircleCheckBig className="size-5" />}
          value={outstandingTasks.length}
          label={
            outstandingTasks.length === 1 ? "Task to complete" : "Tasks to complete"
          }
          isLoading={projectTasks?.isPending}
          to="/tasks"
        />
        <StatCard
          tone="primary"
          icon={<FileText className="size-5" />}
          value={projectDocs?.value?.data?.length ?? 0}
          label={
            (projectDocs?.value?.data?.length ?? 0) === 1 ? "Document" : "Documents"
          }
          isLoading={projectDocs?.isPending}
          to="/documents"
        />
        <StatCard
          tone="green"
          icon={<TrendingUp className="size-5" />}
          value={`${progress}%`}
          label="Project progress"
          isLoading={journey?.isPending}
          to="/journey"
        />
      </div>

      {/* Needs your attention + Next milestone */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Needs your attention — outstanding tasks only */}
        <Card>
          <CardHeader className="space-y-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flag className="size-5 text-black" />
              Needs your attention
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tasks waiting on you. Click one to take action.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectTasks?.isPending ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[62px] rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : outstandingTasks.length === 0 ? (
              <div className="py-10 px-4 rounded-lg border border-brand-border bg-[#F8F8F8] flex flex-col items-center gap-2">
                <CheckCircle2 className="size-6 text-[#00AA3B]" />
                <p className="text-sm text-brand-fade">
                  You&apos;re all caught up. Nothing needs your attention.
                </p>
              </div>
            ) : (
              outstandingTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => navigate(`/tasks/${projectId}/${task.id}`)}
                  className="w-full flex items-center justify-between gap-3 rounded-lg border border-[#0000001A] bg-white p-3 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${
                        {
                          Overdue: "bg-[#FB002B]",
                          "In Progress": "bg-[#B78026]",
                          "Not started": "bg-gray-400",
                          Completed: "bg-[#00AA3B]",
                        }[getDisplayedStatus(task.status, getTaskDueDate(task))]
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-primary truncate">
                        {task.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {safeFormatDate(getTaskDueDate(task), "MMM d, yyyy", "No due date")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TaskDisplayBadge
                      status={task.status}
                      dueDate={getTaskDueDate(task)}
                      size="sm"
                    />
                    <ChevronRight className="size-4 text-brand-fade" />
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Next milestone */}
        <Card>
          <CardHeader className="space-y-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="size-5 text-black" />
              Next milestone
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Where your project is right now.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {journey?.isPending ? (
              <div className="space-y-3">
                <div className="h-6 w-40 rounded bg-slate-200 animate-pulse" />
                <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
              </div>
            ) : (
              <>
                <div>
                  <p className="text-base font-semibold text-primary">
                    {currentMilestone?.name ?? activeProject?.milestone?.name ?? "—"}
                  </p>
                  {currentMilestoneDates?.endDate && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Flag className="size-3.5" />
                      Estimated completion:{" "}
                      <span className="font-semibold text-foreground">
                        {formatMilestoneDate(currentMilestoneDates.endDate)}
                      </span>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{progress}% complete</span>
                    <span className="text-muted-foreground">
                      Stage {safeIndex + 1} of {journeyLength}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
