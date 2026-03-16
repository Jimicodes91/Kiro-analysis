import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { TaskCategory } from "@/types/task.types";
import { useState } from "react";
import { IoArrowBack, IoPeople, IoPersonAdd } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";

const taskTypeOptions = [
  {
    value: TaskCategory.INTERNAL,
    title: "Internal Task",
    description: "Assign tasks to your team members (Admin, Consultant)",
    icon: IoPeople,
  },
  {
    value: TaskCategory.EXTERNAL,
    title: "External Task",
    description: "Assign tasks to clients with required information checklist",
    icon: IoPersonAdd,
  },
];

const TaskTypeSelectorPage = () => {
  const [selected, setSelected] = useState<TaskCategory | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") ?? "";
  const from = searchParams.get("from") ?? "";

  const getReturnPath = () => {
    if (from === "admin") return "/admin?selectedTab=task";
    if (from.startsWith("project:")) return `/projects/${from.split(":")[1]}`;
    return "/task";
  };
  const backPath = getReturnPath();

  const handleNext = () => {
    if (!selected) return;
    const base = selected === TaskCategory.INTERNAL
      ? "/task/new/internal"
      : "/task/new/external";
    const params = new URLSearchParams();
    if (projectId) params.set("projectId", projectId);
    if (from) params.set("from", from);
    const qs = params.toString();
    navigate(`${base}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="mx-3 sm:mx-4 md:mx-6 my-2">
      <div className="flex items-center gap-4 my-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backPath)}>
          <IoArrowBack className="w-5 h-5" />
        </Button>
        <Heading size="h3">Create New Task</Heading>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <p className="text-sm text-[#00000080] mb-6">
          Select the type of task you want to create
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {taskTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-black bg-[#F5F5F5]"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-black" : "text-gray-400"}`} />
                <h3 className="font-semibold text-base mb-1">{option.title}</h3>
                <p className="text-sm text-[#00000080]">{option.description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => navigate(backPath)}>
            Cancel
          </Button>
          <Button onClick={handleNext} disabled={!selected}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskTypeSelectorPage;
