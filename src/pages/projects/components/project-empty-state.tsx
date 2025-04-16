import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { PAGES } from "@/lib/constants";
import { IoSearchOutline } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function ProjectEmptyState() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-6 animate-in fade-in-0 duration-700 ease-in-out">
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
        <div className="h-full w-full bg-gray-100 flex text-center justify-center items-center">
          <div>
            <div className="grid place-items-center h-20 w-20 bg-brand-primary/60">
              <Icons.arrow className="h-4 w-4" />
            </div>
            <Heading>No project to show yet</Heading>
            <p className="text-brand-text">
              You&apos;ve got a blank state. Add project to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectEmptyState;
