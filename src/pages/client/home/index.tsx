"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { addDaysUtil, getFormattedText } from "@/lib/utils";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";
import { getUserSession } from "@/services/api.service";
import { format } from "date-fns";
import {
  Calendar,
  CircleCheckBig,
  FolderOpen,
  LocateFixedIcon,
  Settings,
} from "lucide-react";

export default function ClientHomePage() {
  const user = getUserSession();
  const { activeProject } = useClientProjectContext();

  return (
    <div className="space-y-6 mx-3 sm:mx-6 my-4 page-fade-in">
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
          <div className="p-4 space-y-2 bg-[#FBFBFB] border border-[#0000000A] rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                {activeProject?.milestone?.name}{" "}
                <span className="text-muted-foreground">
                  (duration {activeProject?.milestone?.duration} days)
                </span>
              </p>
              <p className="text-sm mt-1 text-right font-medium">40%</p>
            </div>

            <Progress value={40} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <CircleCheckBig className="size-9 text-black" />
            <div className="space-y-1">
              <p className="text-[#191819]">Tasks</p>
              <p className="text-2xl font-bold">5/10</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <LocateFixedIcon className="size-9 text-black" />
            <div className="space-y-1">
              <p className="text-[#191819]">Milestones</p>
              <p className="text-2xl font-bold">3/5</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <FolderOpen className="size-9 text-black" />
            <div className="space-y-1">
              <p className="text-muted-foreground">Documents</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Milestones */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="-space-y-0">
            <CardTitle className="text-lg flex gap-2 items-center">
              <CircleCheckBig className="h-5 w-5 text-black" />
              Recent Task
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your current and upcoming task
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <TaskItem
              title="Review project requirements"
              due="Due 2024-06-28"
              status="Completed"
            />
            <TaskItem
              title="Submit financial documents"
              due="Due 2024-07-02"
              status="In progress"
            />
            <TaskItem
              title="Approve design mockups"
              due="Due 2024-07-05"
              status="In progress"
            />
          </CardContent>
        </Card>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader className="space-y-0">
            <CardTitle className="text-lg flex gap-2 items-center">
              <LocateFixedIcon className="h-5 w-5 text-black" />
              Upcoming Milestones
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Key project milestones and deadlines
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <MilestoneItem
              title="Development Phase 1"
              info="Started: Nov 2, 2023 • Due: July 15, 2025"
              status="In progress"
            />
            <MilestoneItem
              title="Design Phase Completion"
              info="Completed: Nov 2, 2023"
              status="Completed"
            />
            <MilestoneItem
              title="Project Kickoff"
              info="Completed: Nov 2, 2023"
              status="Completed"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskItem({
  title,
  due,
  status,
}: {
  title: string;
  due: string;
  status: "Completed" | "In progress";
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between rounded-lg border p-3 bg-[#F3F3F3] border-[#0000001A]">
      <div className="space-y-2">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{due}</p>
      </div>
      <Badge
        variant={status === "Completed" ? "success" : "secondary"}
        className={
          status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }
      >
        {status}
      </Badge>
    </div>
  );
}

function MilestoneItem({
  title,
  info,
  status,
}: {
  title: string;
  info: string;
  status: "Completed" | "In progress";
}) {
  return (
    <div className="flex items-center flex-wrap gap-2 justify-between rounded-lg border p-3 bg-[#F3F3F3] border-[#0000001A]">
      <div className="space-y-2">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="size-4 text-[#191919B2]" />
          {info}
        </p>
      </div>
      <Badge
        variant={status === "Completed" ? "success" : "secondary"}
        className={
          status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }
      >
        {status}
      </Badge>
    </div>
  );
}
