import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import React from "react";

const TaskEmptyState: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center space-y-1 h-96">
      <div className="grid place-items-center rounded-full h-16 w-16 bg-brand-primary/60">
        <Icons.task className="h-8 w-8" />
      </div>
      <Heading size="h3">No tasks to show yet</Heading>
      <p className="text-brand-text text-sm">
        You&apos;ve got a blank slate. We'll let you know when new tasks arrive
      </p>
    </div>
  );
};

export default TaskEmptyState;
