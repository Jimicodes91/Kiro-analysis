import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
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
    <div>
      <div className="p-6 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex gap-4 items-stretch md:items-center justify-between flex-col md:flex-row">
          <div className="flex items-center gap-4">
            <Heading size="h3">Project</Heading>
            <div className="relative w-full min-w-[300px]">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3" />
              <Input
                placeholder="Search keyword"
                className="w-full pl-8"
                value={search}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
                type="search"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div>
              <Select value={activeProjectType} onValueChange={changeActiveProjectType}>
                <SelectTrigger
                  isLoading={projectTypes.isLoading}
                  className="min-w-[150px]"
                >
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes?.value &&
                    projectTypes?.value?.data?.map((item) => (
                      <SelectItem key={item.id} value={`${item.id}`}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => navigate(PAGES.PROJECT_CREATE_PAGE)}
              leftIcon={<LuPlus fontSize={10} />}
            >
              Add project
            </Button>
          </div>
        </div>
        <div className="border-[1px] border-brand-border rounded-lg mt-4 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ActiveProjectTypeProjectWrapperOnAdminView;
