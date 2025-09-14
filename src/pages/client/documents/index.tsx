import useGetAllProjectDocuments from "@/hooks/project-modules/documents/use-get-all-documents";
import ProjectDocumentSection from "@/pages/Home/project-details/template/project-document-template";
import { useClientProjectContext } from "@/pages/Home/Project/context/client-project-context";

export default function ClientDocumentManagement() {
  const { activeProject } = useClientProjectContext();
  const projectDocs = useGetAllProjectDocuments(activeProject?.id ?? "");

  return (
    <div className="p-6 space-y-4 bg-gray-50  page-fade-in">
      <div className="space-y-1 mb-10">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          Document Management
          {projectDocs?.isPending ? (
            <div className="h-6 w-[40px] bg-slate-300 animate-pulse"></div>
          ) : (
            <span className="text-lg font-medium">
              ({projectDocs?.value?.data?.length})
            </span>
          )}
        </h1>

        <p className="text-[#19181980] text-sm">
          Upload, manage, and track your project documents
        </p>
      </div>

      {/* Review project requirements document */}
      <div className="bg-white space-y-7 p-4 rounded-xl">
        <ProjectDocumentSection projectId={activeProject?.id as string} isClient />
      </div>
    </div>
  );
}
