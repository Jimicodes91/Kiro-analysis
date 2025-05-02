import { Upload } from "lucide-react";
import { ChangeEvent, DragEvent, FC, useRef, useState } from "react";
import { Icons } from "./icons";

// Define types for attachment object
export interface AttachmentFile {
  name: string;
  url: string; // Base64 string
  size: number;
}

// Define props interface for the component
export interface FileUploadProps {
  onAttachmentsChange?: (files: AttachmentFile[]) => void;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  initialAttachments?: AttachmentFile[];
  disabled?: boolean;
}

const FileUpload: FC<FileUploadProps> = ({
  onAttachmentsChange,
  maxFileSize = 50 * 1024 * 1024, // Default 50MB max size
  acceptedFileTypes = ["pdf", "docx", "xlsx", "png", "jpg"], // Default accepted types
  initialAttachments = [], // Optional initial attachments
  disabled = false,
}) => {
  const [attachments, setAttachments] = useState<AttachmentFile[]>(initialAttachments);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const processFiles = (files: FileList | null): void => {
    if (!files || files.length === 0 || disabled) return;
    setError("");

    Array.from(files).forEach((file) => {
      // File size validation
      if (file.size > maxFileSize) {
        setError(
          `File "${file.name}" exceeds the maximum size limit of ${formatFileSize(maxFileSize)}`
        );
        return;
      }

      // File type validation
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(extension)) {
        setError(
          `File type ".${extension}" is not supported. Please use: ${acceptedFileTypes.join(", ")}`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result as string;
        const newAttachments = [
          ...attachments,
          {
            name: file.name,
            url: result,
            size: file.size,
          },
        ];

        setAttachments(newAttachments);

        // Notify parent component if callback exists
        if (onAttachmentsChange) {
          onAttachmentsChange(newAttachments);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (disabled) return;
    processFiles(e.target.files);
    // Reset input so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    // Only set isDragging to false if we're leaving the drop area
    // and not entering a child element
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Get the files from the drop event
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const removeAttachment = (index: number): void => {
    if (disabled) return;
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);

    // Notify parent component if callback exists
    if (onAttachmentsChange) {
      onAttachmentsChange(newAttachments);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area - only show when not disabled */}
      {!disabled && (
        <div
          ref={dropAreaRef}
          className={`border-2 border-dashed ${isDragging ? "border-primary bg-[#E0EFDE80]" : "border-[#00000033]"} rounded-lg p-6 text-center cursor-pointer bg-[#E0EFDE4D] hover:bg-[#E0EFDE80] transition-colors`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className={`h-6 w-6 ${isDragging ? "text-primary" : "text-black"}`} />
            <p className="text-sm font-semibold text-[#191819]">
              Drag file here to upload or choose file
            </p>
            <p className="text-xs font-medium text-[#00000080]">
              {acceptedFileTypes.map((type) => type.toUpperCase()).join(", ")} format, up
              to {formatFileSize(maxFileSize)}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept={acceptedFileTypes.map((type) => `.${type}`).join(",")}
            disabled={disabled}
          />
        </div>
      )}

      {/* Error message */}
      {error && <div className="text-sm text-red-500 mt-1">{error}</div>}

      {/* Attachment List */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-black rounded-[6px]"
            >
              <div className="flex items-center space-x-3">
                <Icons.document />

                <div className="truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                </div>
              </div>
              {/* Only show delete button when not disabled */}
              {!disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAttachment(index);
                  }}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Icons.trash className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
