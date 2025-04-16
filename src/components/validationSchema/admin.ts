import * as yup from "yup";

export const addUserSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
});

export const addDocumentTypeSchema = yup.object().shape({
  typeName: yup.string().required("Type name is required"),
  accessLevel: yup.string().required("Access Level is required"),
  expirationPolicy: yup.number().required("Expiration policy is required"),
});

export const addEventTypeSchema = yup.object().shape({
  typeName: yup.string().required("Type name is required"),
  description: yup.string().required("Description is required"),
});

export const addTaskTypeSchema = yup.object().shape({
  typeName: yup.string().required("Type name is required"),
  description: yup.string().required("Description is required"),
});

export const addProjectPipelineSchema = yup.object().shape({
  pipelineName: yup.string().required("Pipeline name is required"),
});

export const addStageSchema = yup.object().shape({
  stageName: yup.string().required("Stage name is required"),
  duration: yup.string().required("Duration is required"),
});
