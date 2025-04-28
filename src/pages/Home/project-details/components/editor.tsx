import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Repeat } from "lucide-react";
import React, { useState } from "react";

export const NoteEditor: React.FC = () => {
  const [visibleToClient, setVisibleToClient] = useState(false);

  const formatText = (command: "bold" | "italic" | "removeFormat") => {
    document.execCommand(command, false);
  };

  const handleSend = () => {
    const plainText = (document.getElementById("editor") as HTMLElement).innerHTML;
    console.log("Sending Note:", {
      text: plainText,
      visibleToClient,
    });
    // Reset after send
    setVisibleToClient(false);
    (document.getElementById("editor") as HTMLElement).innerHTML = "";
  };

  return (
    <div className="border-2 border-brand-border rounded-lg p-4 min-h-[110px] flex flex-col justify-between">
      <div
        id="editor"
        contentEditable
        contextMenu=""
        className="min-h-[50px] outline-none text-gray-800"
      >
        Add new note
      </div>

      <div className="flex items-center mt-4">
        {/* Formatting buttons */}
        <div className="flex gap-3">
          <Toggle aria-label="Toggle bold" onClick={() => formatText("bold")}>
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle bold" onClick={() => formatText("italic")}>
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle aria-label="Toggle bold" onClick={() => formatText("removeFormat")}>
            <Repeat className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Checkbox + Send button */}
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={visibleToClient}
              onChange={(e) => setVisibleToClient(e.target.checked)}
              className="w-4 h-4"
            />
            Make visible to client
          </label>

          <button
            onClick={handleSend}
            className="ml-2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800"
          >
            ✈️
          </button>
        </div>
      </div>
    </div>
  );
};
