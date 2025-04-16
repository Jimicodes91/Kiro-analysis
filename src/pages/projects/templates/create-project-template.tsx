import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import Loader from "@/components/ui/loader";
import useGetProjectFormFields from "@/hooks/project-modules/project-forms/use-get-project-form-fields";
import { PAGES } from "@/lib/constants";
import { Link } from "react-router-dom";
import CreateProjectDynamicForm from "../components/project-dynamic-form";

function CreateProjectTemplate() {
  const projectFormFields = useGetProjectFormFields();

  const renderForm = () => {
    if (projectFormFields.isLoading) return <Loader />;

    if (!projectFormFields.isLoading && projectFormFields?.value) {
      return <CreateProjectDynamicForm fields={projectFormFields?.value?.data} />;
    }
    return <p>Some thing went wrong</p>;
  };

  return (
    <div>
      <div className="space-y-3 p-6">
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
        <div className="w-full bg-brand-gray grid place-items-center p-6">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

export default CreateProjectTemplate;
