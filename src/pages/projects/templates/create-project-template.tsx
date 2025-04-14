import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { PAGES } from "@/lib/constants";
import { Link } from "react-router-dom";
import CreateProjectForm from "../components/project-creation-form";

function CreateProjectTemplate() {
  return (
    <div className="space-y-3">
      <div>
        <p>
          <Link to={PAGES.PROJECT_PAGE}>
            <Button
              leftIcon={<Icons.arrow />}
              variant="ghost"
              size="icon"
              className="ml-3"
            >
              Project
            </Button>
          </Link>
        </p>
        <Heading size="h3">Add Project</Heading>
      </div>
      <div className="w-full bg-brand-gray grid place-items-center p-6">
        <CreateProjectForm />
      </div>
    </div>
  );
}

export default CreateProjectTemplate;
