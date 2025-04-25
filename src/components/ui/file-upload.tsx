import { convertToKilobyte } from "@/lib/utils";
import { File, Trash2, UploadCloud } from "lucide-react";
import { ChangeEvent, DragEvent } from "react";

interface FileUploadProps {
  value?: File;
  onChange: (file?: File) => void;
  id: string;
}

const DragNdrop = ({ value, onChange, id }: FileUploadProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      onChange(selectedFiles[0]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      onChange(droppedFiles[0]);
    }
  };

  const handleRemoveFile = () => {
    onChange(undefined);
  };

  return (
    <section className="">
      <div
        className={`border-[1.5px] rounded-md border-brand-file p-4 bg-white flex flex-col items-center justify-center relative ${
          value ? "border-pri-base" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {value ? (
          <>
            <div className="flex items-center w-full gap-4">
              <div className="w-fit">
                <File />
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-[600] text-brand-label">{value?.name}</p>
                {/* <p className="font-[600] text-brand-label">{value?.type}</p> */}
                <p className="text-brand-text">
                  {convertToKilobyte(value?.size)}KB - 100% uploaded
                </p>
              </div>
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="w-6 h-6 border-2 border-pri-base cursor-pointer grid place-items-center rounded-full text-white bg-pri-base"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="upload-info">
              <div className="w-fit mx-auto">
                <UploadCloud />
              </div>
            </div>
            <input
              type="file"
              hidden
              id={id}
              name={id}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls,.xlsm,.xltm,.xlam,.xlsb,.xltx,.xlt"
            />
            <div className="text-center text-sm text-brand-text">
              <div>
                <label
                  htmlFor={id}
                  className="inline-flex cursor-pointer text-pri-base font-bold"
                >
                  Click to upload
                </label>
                <span> or drag and drop</span>
              </div>
              <p className="text-xs">Upload only XLSX or CSV </p>

              <p className="text-brand-text text-[10px] pt-3 font-light text-center">
                PDF, DOCX, XLSX, PNG, JPG format, up to 50MB
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DragNdrop;
