import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useGetClientProjects from "@/hooks/project-modules/use-get-client-projects";
import { projectStatusList } from "@/lib/constants";
import { getFormattedText } from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { ClientProjectCard } from "../../project-details/components/client-project-card";
import { useOrgProjectContext } from "../context/org-project-context";

const ClientProjectView = () => {
  const [, setSearchQuery] = useState("");
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const { changeStatus, status } = useOrgProjectContext();
  const user = getUserSession();
  const allProjects = useGetClientProjects(user?.id ?? "", status);

  const renderBody = () => {
    if (allProjects.isPending)
      return (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div
              className="p-5 min-h-[123px] rounded-lg border-brand-border border animate-pulse flex justify-between items-center"
              key={i}
            >
              <div className="space-y-2 w-full max-w-[300px]">
                <div className="h-8 w-full max-w-[200px] bg-slate-200 rounded-md"></div>
                <div className="h-8 w-full max-w-[150px] bg-slate-200 rounded-md"></div>
                <div className="h-8 w-full max-w-[100px] bg-slate-200 rounded-full"></div>
              </div>
              <div className="w-10 h-6 bg-slate-200"></div>
            </div>
          ))}
        </div>
      );

    if (allProjects?.isError)
      return (
        <div className="py-20 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (allProjects?.value?.data?.length === 0)
      return (
        <div className="py-20 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">No project found</p>
        </div>
      );

    return (
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        {allProjects?.value?.data?.map((project) => (
          <ClientProjectCard projectDetails={project} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="p-3 sm:p-4 md:p-6 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex gap-3 md:gap-4 items-stretch md:items-center justify-between flex-col md:flex-row">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <Heading size="h3">Projects</Heading>
            <div className="relative flex-1 md:flex-initial md:min-w-[300px]">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3" />
              <Input
                placeholder="Search keyword"
                className="w-full pl-8"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="border-[1px] border-brand-border rounded-lg mt-4 p-4 space-y-6 min-h-[calc(100vh-200px)]">
          <div>
            <Select value={status} onValueChange={changeStatus}>
              <SelectTrigger className="min-w-[150px] h-10">
                <SelectValue placeholder="Select status" className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                {projectStatusList?.map((item) => (
                  <SelectItem
                    className="capitalize"
                    key={item.value}
                    value={`${item.value}`}
                  >
                    {getFormattedText(item.text)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="">{renderBody()}</div>
        </div>
      </div>
    </div>
  );
};

export default ClientProjectView;
