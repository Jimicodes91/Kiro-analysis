import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { PAGES } from "@/lib/constants";
import { IoSearchOutline } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import ProjectEmptyStateCard from "./project-empty-state-card";

function ProjectEmptyState() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-6 min-h-[calc(100vh-70px)] flex flex-col space-y-5 animate-in fade-in-0 duration-700 ease-in-out">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Heading size="h3">Project</Heading>
            <div className="relative w-full min-w-[300px]">
              <IoSearchOutline className="absolute top-[50%] -translate-y-[50%] left-3" />
              <Input placeholder="Search keyword" className="w-full pl-8" />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-5 md:mt-0">
            <Button
              onClick={() => navigate(PAGES.PROJECT_CREATE_PAGE)}
              leftIcon={<LuPlus fontSize={10} />}
            >
              Add project
            </Button>
          </div>
        </div>
        <ProjectEmptyStateCard />
      </div>
    </div>
  );
}

export default ProjectEmptyState;
