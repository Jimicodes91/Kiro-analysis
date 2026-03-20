import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import { PAGES } from "@/lib/constants";
import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useOrgProjectContext } from "../context/org-project-context";

const ActiveProjectTypeProjectWrapperOnAdminView = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const projectTypes = useGetAllProjectTypes();
  const { changeActiveProjectType, activeProjectType, search, handleSearch } =
    useOrgProjectContext();

  return (
    <div className="p-4 sm:p-5 md:p-6 animate-in fade-in-0 duration-500 ease-in-out">
      {/* Page header */}
      <div className="flex gap-3 md:gap-4 items-stretch md:items-center justify-between flex-col md:flex-row">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
            Projects
          </h1>
          <div className="relative flex-1 md:flex-initial md:min-w-[280px] lg:min-w-[320px]">
            <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              className="w-full pl-9 h-10 text-sm"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              type="search"
            />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Select value={activeProjectType} onValueChange={changeActiveProjectType}>
            <SelectTrigger
              isLoading={projectTypes.isLoading}
              className="min-w-[160px] h-10 text-sm"
            >
              <SelectValue placeholder="Select pipeline" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes?.value?.data?.map((item) => (
                <SelectItem key={item.id} value={`${item.id}`}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => navigate(PAGES.PROJECT_CREATE_PAGE)}
            leftIcon={<LuPlus className="h-4 w-4" />}
            className="h-10 text-sm whitespace-nowrap"
          >
            Add project
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="mt-5 border border-gray-200 rounded-xl bg-white p-4 sm:p-5">
        {children}
      </div>
    </div>
  );
};

export default ActiveProjectTypeProjectWrapperOnAdminView;
