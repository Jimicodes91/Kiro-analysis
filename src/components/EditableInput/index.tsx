"use client";

import { Button } from "@/components/ui/button";
import { Check, Pen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InlineEditableProps {
  value: string | number;
  onChange: (newValue: string) => void;
  placeholder?: string;
  isTextArea?: boolean;
  isLoading?: boolean;
}

export function InlineEditable({
  value,
  onChange,
  placeholder = "Enter value",
  isTextArea,
  isLoading = false,
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const Comp = isTextArea ? "textarea" : "input";
  // Focus input automatically when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(draftValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftValue(String(value));
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 relative w-full">
      {!isEditing ? (
        isLoading ? (
          <div className="pl-0.5 py-1 min-h-7 text-sm text-gray-900 rounded-sm w-full hover:bg-muted cursor-pointer animate-pulse bg-gray-300"></div>
        ) : (
          <div
            key={value}
            className="pl-0.5 py-1 group/edit text-sm flex items-center text-gray-900 rounded-sm w-full hover:bg-muted cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {draftValue || <span className="text-muted-foreground">{placeholder}</span>}
            <Pen className="ml-3 size-3 group-hover/edit:text-gray-700 text-transparent" />
          </div>
        )
      ) : (
        <div className="flex items-center flex-col gap-2 w-full px-1">
          <Comp
            // @ts-expect-error TODO
            ref={inputRef}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="w-full px-1 py-0.5 rounded-sm text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="w-fit absolute top-7 pt-0.5 right-0 space-x-0.5">
            <Button
              size="icon"
              variant="ghost"
              className="bg-gray-100 size-6 shadow-sm rounded-none"
              onClick={handleSave}
            >
              <Check className="w-4 h-4 text-black" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-gray-100 size-6 shadow-sm rounded-none"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 text-black" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
