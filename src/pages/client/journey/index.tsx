"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ViewToggle from "@/components/ui/view-toggle";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, CircleDot, MoveDown, MoveRight } from "lucide-react";
import { useState } from "react";
import ProjectDurationBar from "../home/components/project-duration-bar";

export default function ClientProjectJourney() {
  const [view, setView] = useState<string>("list");

  const milestones = [
    {
      title: "Project kickoff",
      description: "Initial project planning and requirement gathering conversations.",
      status: "Completed",
      date: "Jan 01, 2025 - Jan 07, 2025",
    },
    {
      title: "Product design",
      description: "UI/UX design and wireframes finalized by product design team.",
      status: "Completed",
      date: "Jan 07, 2025 - Mar 11, 2025",
    },
    {
      title: "Development phase 1",
      description: "Core product functionality implemented by backend engineering team.",
      status: "In progress",
      date: "Feb 10, 2025 - Jul 12, 2025",
    },
    {
      title: "User testing",
      description: "Beta testing sessions with QA team and selected beta testers.",
      status: "Not started",
      date: "Nov 05, 2025 - Dec 12, 2025",
    },
    {
      title: "Development phase 3",
      description: "Core user interface implemented by frontend engineering team.",
      status: "Not started",
      date: "Sep 23, 2025 - Nov 02, 2025",
    },
    {
      title: "Development phase 2",
      description: "Core user interface implemented by frontend engineering team.",
      status: "Not started",
      date: "Mar 12, 2025 - Sep 22, 2025",
    },
  ];

  return (
    <div className="space-y-6 mx-3 sm:mx-6 my-4 page-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Project Journey</h1>
        <p className="text-muted-foreground">
          Track your project&apos;s milestones and progress
        </p>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-4">
          <ProjectDurationBar />
        </CardContent>
      </Card>

      {/* Milestones Section */}
      <Card>
        <CardHeader className="flex flex-col gap-5">
          <CardTitle className="text-xl">
            Milestones Timelines{" "}
            <span className="font-light text-lg">({milestones.length})</span>
          </CardTitle>
          <div className="flex items-center justify-between gap-2">
            <ViewToggle
              activeTab={view}
              setActiveTab={setView}
              options={[
                { value: "list", label: "List view " },
                { value: "grid", label: "Grid view" },
              ]}
            />
            <Button variant="outline" size="sm">
              View Activity
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {view === "list" ? (
            /* --- List View (Timeline) --- */
            <div className="space-y-6 animate-in fade-in-0 duration-700 ease-in-out">
              {milestones.map((m, i) => (
                <div key={i} className="relative pl-6">
                  {/* Connector line */}
                  {i < milestones.length - 1 && (
                    <span className="absolute left-2 top-6 h-full w-[2px] bg-muted-foreground/20" />
                  )}

                  {/* Status Icon */}
                  <span className="absolute left-0 top-2">
                    {m.status === "Completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : m.status === "In progress" ? (
                      <CircleDot className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>

                  {/* Content */}
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={cn(
                          "px-2 py-1 text-xs",
                          m.status === "Completed" && "bg-emerald-100 text-emerald-700",
                          m.status === "In progress" && "bg-amber-100 text-amber-700",
                          m.status === "Not started" && "bg-red-100 text-red-700"
                        )}
                      >
                        {m.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{m.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* --- Grid View (Flow with Arrows) --- */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in-0 duration-700 ease-in-out">
              {milestones.map((m, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <Card className="w-full bg-[#F3F3F3] shadow-none border border-[#0000001A]">
                    <CardContent className="p-4 space-y-2">
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">{m.date}</p>
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs",
                            m.status === "Completed" && "bg-emerald-100 text-emerald-700",
                            m.status === "In progress" && "bg-amber-100 text-amber-700",
                            m.status === "Not started" && "bg-red-100 text-red-700"
                          )}
                        >
                          {m.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Simple arrow connector (example, adjust per row/col) */}
                  {i < milestones.length - 1 && i !== 2 && (
                    <span className="absolute right-[-30px] top-1/2 hidden md:block">
                      <MoveRight className="h-5 w-5 text-muted-foreground" />
                    </span>
                  )}
                  {i === 2 && (
                    <span className="absolute left-1/2 bottom-[-30px] transform -translate-x-1/2">
                      <MoveDown className="h-5 w-5 text-muted-foreground" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
