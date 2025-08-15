"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InlineEditableProps {
  value: string | number;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

export function InlineEditable({
  value,
  onChange,
  placeholder = "Enter value",
}: InlineEditableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

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
        <div
          className="pl-0.5 py-1 text-sm text-gray-900 rounded-sm w-full hover:bg-muted cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {value || <span className="text-muted-foreground">{placeholder}</span>}
        </div>
      ) : (
        <div className="flex items-center flex-col gap-2 w-full px-1">
          <input
            ref={inputRef}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={() => setIsEditing(false)}
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
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-gray-100 size-6 shadow-sm rounded-none"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
