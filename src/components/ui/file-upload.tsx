import { convertToKilobyte } from "@/lib/utils";
import { File, Trash2, Upload } from "lucide-react";
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
        className={`border-[1.5px] rounded-md border-dashed p-4 bg-[#E0EFDE4D] flex flex-col items-center justify-center relative ${
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
              accept=".csv,.xlsx,.xls,.xlsm,.xltm,.xlam,.xlsb,.xltx,.xlt"
            />
            <div className="text-center text-sm space-y-3 text-brand-text">
              <div>
                <span> Drag file here to upload or</span>{" "}
                <label
                  htmlFor={id}
                  className="inline-flex cursor-pointer text-pri-base font-bold"
                >
                  choose file
                </label>
              </div>

              <p className="text-brand-text text-xs text-center">
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
