"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import { addDaysUtil, getFormattedText } from "@/lib/utils";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { format } from "date-fns";
import { FolderOpen, Settings } from "lucide-react";
import MilestoneMetricCard from "./components/milestone-metric-card";
import ProjectDurationBar from "./components/project-duration-bar";
import RecentTaskCard from "./components/recent-tasks-card";
import TaskMetricCard from "./components/task-metrics-card";
import UpcomingMilestones from "./components/upcoming-milestones";

export default function ClientHomePage() {
  const user = getUserSession();
  const { activeProject } = useClientProjectContext();
  const projectDocs = useGetAllProjectDocuments(activeProject?.id ?? "");

  return (
    <div className="space-y-6 mx-3 sm:mx-6 py-4 page-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Welcome {user?.name}</h1>
          <p className="text-muted-foreground">Here&apos;s your project overview.</p>
        </div>
        <Button size="sm" className="flex items-center gap-2 px-3">
          <Settings className="h-4 w-4" />
          Customize Dashboard
        </Button>
      </div>

      {/* Project Card */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{activeProject?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(activeProject?.start_date ?? ""), "MMM d, yyyy")} -{" "}
              {addDaysUtil(
                activeProject?.start_date,
                +(activeProject?.project_timeline?.[0] ?? 0) as unknown as number
              )}
            </p>
          </div>
          <Badge variant={activeProject?.status} className="w-fit">
            {getFormattedText(activeProject?.status)}
          </Badge>
        </CardHeader>
        <CardContent>
          <ProjectDurationBar />
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TaskMetricCard />
        <MilestoneMetricCard />
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <FolderOpen className="size-9 text-black" />
            <div className="space-y-1">
              <p className="text-muted-foreground">Documents</p>
              <p className="text-2xl font-bold">
                {projectDocs?.isPending ? (
                  <div className="h-8 w-[40px] bg-slate-300 animate-pulse"></div>
                ) : (
                  projectDocs?.value?.data?.length
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Milestones */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <RecentTaskCard />
        <UpcomingMilestones />
        {/* Upcoming Milestones */}
      </div>
    </div>
  );
}
