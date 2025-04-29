import useCreateNote from "@/hooks/project-modules/note/use-create-note";
import NoteCard from "../components/cards/note-card";
import { NoteEditor } from "../components/editor";

function ProjectNoteSection({ projectId }: { projectId: string }) {
  useCreateNote(projectId);
  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <NoteEditor />
        <div>
          <NoteCard />
        </div>
      </div>
    </>
  );
}

export default ProjectNoteSection;
