import { TaskCategoryType } from "@/types/task.types";
import DocUploadFields from "./doc-upload-fields";
import InfoRequestFields from "./info-request-fields";
import SigningTaskFields from "./signing-task-fields";
import StandardTaskFields from "./standard-task-fields";

interface TypeFieldsSectionProps {
  control: any;
  categoryType: string | undefined;
}

export default function TypeFieldsSection({
  control,
  categoryType,
}: TypeFieldsSectionProps) {
  switch (categoryType) {
    case TaskCategoryType.SIGNING:
      return <SigningTaskFields control={control} />;
    case TaskCategoryType.INFORMATION_REQUEST:
      return <InfoRequestFields control={control} />;
    case TaskCategoryType.DOCUMENT_UPLOAD:
      return <DocUploadFields control={control} />;
    case TaskCategoryType.REVIEW:
    case TaskCategoryType.APPROVAL:
    case TaskCategoryType.MEETING:
    case TaskCategoryType.FOLLOW_UP:
      return <StandardTaskFields control={control} />;
    default:
      return null;
  }
}

export const TASK_CATEGORY_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: "Signing", value: TaskCategoryType.SIGNING },
  { label: "Information Request", value: TaskCategoryType.INFORMATION_REQUEST },
  { label: "Document Upload", value: TaskCategoryType.DOCUMENT_UPLOAD },
  { label: "Review", value: TaskCategoryType.REVIEW },
  { label: "Approval", value: TaskCategoryType.APPROVAL },
  { label: "Meeting", value: TaskCategoryType.MEETING },
  { label: "Follow Up", value: TaskCategoryType.FOLLOW_UP },
];
