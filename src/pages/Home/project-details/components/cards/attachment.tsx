import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { File, Trash, Upload } from "lucide-react";

function Attachment() {
  return (
    <div className="p-4 border border-brand-border bg-white rounded-lg flex justify-between">
      <div className="flex gap-2 items-center">
        <File className="h-5" />
        <p>Business registration.doc</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon">
          <Upload className="h-5" />
        </Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="icon">
          <Trash className="h-5" />
        </Button>
      </div>
    </div>
  );
}

export default Attachment;
