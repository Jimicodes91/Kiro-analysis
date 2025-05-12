import Toast from "@/components/Toast";
import { convertToKilobyte } from "@/lib/utils";
import { File, Trash2, Upload } from "lucide-react";
import { ChangeEvent, DragEvent } from "react";
import { Button } from "./button";

interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  id: string;
}

const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const DragNdrop = ({ value = [], onChange, id }: FileUploadProps) => {
  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE_BYTES) {
        Toast.error(`File "${file.name}" exceeds 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    const totalFiles = [...value, ...validFiles];
    if (totalFiles.length > MAX_FILES) {
      Toast.error(`Cannot upload more than ${MAX_FILES} files.`, "Upload Error");

      return totalFiles.slice(0, MAX_FILES);
    }

    return totalFiles.slice(0, MAX_FILES);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const updatedFiles = validateFiles(selectedFiles);
      onChange(updatedFiles);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const updatedFiles = validateFiles(droppedFiles);
    onChange(updatedFiles);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...value];
    updatedFiles.splice(index, 1);
    onChange(updatedFiles);
  };

  return (
    <section className="">
      <div
        className={`border-[1.5px] rounded-md border-dashed p-4 bg-[#E0EFDE4D] flex flex-col items-center justify-center relative ${
          value.length ? "border-pri-base" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {value.length > 0 ? (
          <div className="space-y-3 w-full">
            {value.map((file, index) => (
              <div key={index} className="flex items-center w-full gap-4">
                <div className="w-fit">
                  <File />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-[600] text-brand-label">{file.name}</p>
                  <p className="text-brand-text">
                    {convertToKilobyte(file.size)}KB - 100% uploaded
                  </p>
                </div>
                <div className="ml-auto">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <label htmlFor={id} className="cursor-pointer">
            <div className="upload-info">
              <div className="w-fit mx-auto pb-3">
                <Upload />
              </div>
            </div>
            <input
              type="file"
              hidden
              id={id}
              name={id}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
            />
            <div className="text-center text-sm space-y-3 text-brand-text">
              <p className="font-bold text-primary">
                <span> Drag files here to upload or</span> choose files
              </p>
              <p className="text-brand-text text-xs text-center">
                PDF, PNG, JPG format, max 3 files, up to 5MB each
              </p>
            </div>
          </label>
        )}
      </div>
    </section>
  );
};

export default DragNdrop;
