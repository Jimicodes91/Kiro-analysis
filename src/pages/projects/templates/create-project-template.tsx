import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { PAGES } from "@/lib/constants";
import SimplifiedProjectForm from "@/pages/Home/Project/components/simplified-project-form";
import { Link, useNavigate } from "react-router-dom";

function CreateProjectTemplate() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(PAGES.PROJECT_PAGE);
  };

  const handleCancel = () => {
    navigate(PAGES.PROJECT_PAGE);
  };

  return (
    <div>
      <div className="space-y-3 p-3 sm:p-4 md:p-6">
        <div>
          <p>
            <Link to={PAGES.PROJECT_PAGE}>
              <Button
                leftIcon={<Icons.arrow />}
                variant="ghost"
                className="px-0 hover:bg-white"
              >
                Project
              </Button>
            </Link>
          </p>
          <Heading size="h3">Add Project</Heading>
        </div>
        <div className="w-full bg-brand-gray p-3 sm:p-4 md:p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-3 sm:p-4 md:p-6">
            <SimplifiedProjectForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectTemplate;
