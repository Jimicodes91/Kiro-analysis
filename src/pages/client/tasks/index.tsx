import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function ClientTaskManagement() {
  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen page-fade-in">
      <div className="space-y-1 mb-10">
        <h1 className="text-2xl font-semibold">
          Task Management <span className="text-lg font-medium">(5)</span>
        </h1>
        <p className="text-[#19181980] text-sm">
          Manage your assigned tasks and track progress
        </p>
      </div>

      {/* Review project requirements document */}
      <div className="bg-white space-y-7 p-4 rounded-xl">
        <Card className="bg-[#F3F3F3] border border-[#0000001A] shadow-none">
          <CardContent className="p-5 space-y-3">
            <div className="space-y-0">
              <h2 className="text-lg font-semibold">
                Review project requirements document
              </h2>
              <p className="text-[#19181980] text-sm">
                Please review the attached requirements document and provide feedback
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
                Mar 12, 2025 - Sep 22, 2025
              </span>
              <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
                Assigned by: Sarah Johnson
              </span>
            </div>

            <div className="flex space-x-3 mt-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                <span>Requirement.doc</span>
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                <span>Requirement.doc</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit financial documents */}
        <Card className="bg-[#F3F3F3] border border-[#0000001A] shadow-none">
          <CardContent className="p-5 space-y-3">
            <div className="space-y-0">
              <h2 className="text-lg font-semibold">Submit financial documents</h2>
              <p className="text-[#19181980] text-sm">
                Upload the required financial statements and tax documents
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
                Mar 12, 2025 - Sep 22, 2025
              </span>
              <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
                Assigned by: Sarah Johnson
              </span>
            </div>

            <Button variant="outline" size="sm">
              <span>Upload document</span>
            </Button>
          </CardContent>
        </Card>

        {/* Content review and approval */}
        <Card className="bg-[#F3F3F3] border border-[#0000001A] shadow-none">
          <CardContent className="p-5 space-y-3">
            <div className="space-y-0">
              <h2 className="text-lg font-semibold">Content review and approval</h2>
              <p className="text-[#19181980] text-sm">Review landing pages content</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
                Mar 12, 2025 - Sep 22, 2025
              </span>
              <span className="px-2 py-1 text-xs rounded bg-white font-medium text-gray-700">
                Assigned by: Sarah Johnson
              </span>
            </div>

            <div className="space-x-4">
              <a href="https://www.content.com" className="text-blue-600 underline">
                www.content.com
              </a>
              <a href="https://www.material.com" className="text-blue-600 underline">
                www.material.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
