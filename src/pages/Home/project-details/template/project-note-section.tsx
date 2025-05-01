import useGetAllProjectNotes from "@/hooks/project-modules/note/use-get-all-project-notes";
import { compareAsc, parseISO } from "date-fns";
import NoteCard from "../components/cards/note-card";
import { NoteEditor } from "../components/editor";

function ProjectNoteSection({ projectId }: { projectId: string }) {
  const projectNotes = useGetAllProjectNotes(projectId);

  const renderBody = () => {
    if (projectNotes.isPending)
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              className="px-5 py-10 space-y-2 rounded-lg bg-slate-200 flex justify-between  animate-pulse"
              key={i}
            ></div>
          ))}
        </div>
      );

    if (projectNotes?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (projectNotes?.value?.data?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No task currently on this project
          </p>
        </div>
      );

    return (
      <div className="space-y-2">
        {projectNotes?.value?.data
          ?.sort((a, b) => compareAsc(parseISO(b.created_at), parseISO(a.created_at)))
          ?.map((note) => <NoteCard key={note.id} note={note} />)}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <NoteEditor projectId={projectId} />
        <div>{renderBody()}</div>
      </div>
    </>
  );
}

export default ProjectNoteSection;
