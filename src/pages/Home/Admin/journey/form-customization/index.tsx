import Loader from "@/components/ui/loader";
import useGetProjectFormFields from "@/hooks/project-modules/project-forms/use-get-project-form-fields";
import FormCustomization from "./Form";

function FormCustomizationTemplate() {
  const projectFormFields = useGetProjectFormFields();
  const renderForm = () => {
    if (projectFormFields.isLoading) return <Loader />;

    if (
      !projectFormFields.isLoading &&
      projectFormFields?.value &&
      projectFormFields?.value?.data
    ) {
      return <FormCustomization customFields={projectFormFields?.value?.data} />;
    }
    return <p>Some thing went wrong</p>;
  };

  return (
    <div>
      <div className="space-y-3 p-6">
        <div className="w-full bg-brand-gray grid place-items-center p-6">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

export default FormCustomizationTemplate;
