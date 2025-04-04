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

export const addProjectTypeSchema = yup.object().shape({
    projectName: yup.string().required("Project name is required"),
    assignTo: yup.string().required("Assign to is required"),
    billingType: yup.string().required("Billing type is required"),
  });

export const addMilestoneSchema = yup.object().shape({
    milestoneName: yup.string().required("Milestone name is required"),
    assignTo: yup.string().required("Assign to is required"),
    duration: yup.string().required("Duration is required"),
  });

export const addStepSchema = yup.object().shape({
    stepName: yup.string().required("Step name is required"),
    assignTo: yup.string().required("Assign to is required"),
    duration: yup.string().required("Duration is required"),
  });