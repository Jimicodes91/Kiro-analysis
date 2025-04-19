import useCreateProjectType from "@/hooks/project-modules/project-types/use-create-project-type";
import { getUserSession } from "@/services/api.service";
import { addProjectPipelineSchema } from "@/utils/validation-schema/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InferType } from "yup";
import { MainButton } from "../../../../components/Form/button";
import { FormInput } from "../../../../components/Form/input";
import Modal from "../../../../components/Modal";

interface ProjectPipelineFormData {
  pipelineName: string;
}

function PipelineForm({ onClose }: { onClose: () => void }) {
  const session = getUserSession();
  const createProjectType = useCreateProjectType();
  // Project pipeline form
  const {
    register: registerPipeline,
    handleSubmit: handleSubmitPipeline,
    formState: { errors: errorsPipeline },
    reset,
  } = useForm<ProjectPipelineFormData>({
    resolver: yupResolver(addProjectPipelineSchema),
  });

  const onSubmitPipeline = async (data: InferType<typeof addProjectPipelineSchema>) => {
    createProjectType
      .mutateAsync({
        name: data.pipelineName,
        company_id: session?.company_id ?? "",
      })
      .then(() => {
        reset();
        onClose();
      })
      .catch(console.error);
  };
  return (
    <Modal title="Create pipeline" closeModal={() => onClose()} fullHeight={false}>
      <form
        onSubmit={handleSubmitPipeline(onSubmitPipeline)}
        className="flex flex-col gap-4 p-4"
      >
        <FormInput
          label="Pipeline name"
          placeholder="Pipeline name"
          {...registerPipeline("pipelineName")}
          error={errorsPipeline.pipelineName?.message}
        />

        <MainButton modalButton type="submit" isLoading={createProjectType.isPending}>
          Create pipeline
        </MainButton>
      </form>
    </Modal>
  );
}

export default PipelineForm;
