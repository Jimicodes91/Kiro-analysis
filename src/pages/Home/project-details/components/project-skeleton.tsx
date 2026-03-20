import React from "react";

const ProjectDetailSkeleton: React.FC = () => {
  return (
    <div className="p-3 sm:p-4 md:p-6 h-full space-y-6 flex flex-col min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-70px)] animate-pulse max-w-[1440px] mx-auto w-full">
      <div>
        <div className="mb-1">
          <div className="h-5 bg-slate-200 w-[120px]"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="w-[144px] h-8 bg-slate-200"></div>
          <div className="h-10 w-36 bg-slate-200 rounded-full"></div>
        </div>
      </div>

      <div className="bg-white grid grid-cols-1 lg:grid-cols-project-detail flex-1 gap-x-3 rounded-lg border border-brand-border p-3">
        <div className="p-4 min-h-full flex-1 h-max space-y-4 rounded-lg border bg-slate-200"></div>
        <div className="pt-0 h-full grid grid-cols-1 grid-rows-[140px_1fr] gap-2">
          <div className="rounded-lg w-full h-[140px] bg-slate-200"></div>
          <div className="rounded-lg w-full h-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;
