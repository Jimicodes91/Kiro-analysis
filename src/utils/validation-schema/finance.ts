import * as yup from "yup";

export const billingSchema = yup.object().shape({
  client_name: yup.string().required("Client name is required").trim(),
  project_title: yup.string().required("Project title is required").trim(),
  total_project_cost: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" || originalValue === null || originalValue === undefined
        ? undefined
        : value;
    })
    .required("Total amount is required")
    .positive("Amount must be positive")
    .typeError("Total project cost must be a number"),
  amount_paid: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" || originalValue === null || originalValue === undefined
        ? undefined
        : value;
    })
    .required("Amount paid is required")
    .min(0, "Amount cannot be negative")
    .max(
      yup.ref("total_project_cost"),
      "Amount paid cannot be more than total project cost"
    )
    .typeError("Amount paid must be a number"),
  outstanding_balance: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" || originalValue === null || originalValue === undefined
        ? undefined
        : value;
    })
    .required("Outstanding balance is required")
    .min(0, "Balance cannot be negative")
    .typeError("Outstanding balance must be a number"),
  next_payment_due_date: yup
    .string()
    .required("Next payment due date is required")
    .trim(),
});
