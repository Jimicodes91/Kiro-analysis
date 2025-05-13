import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAddComment from "@/hooks/project-modules/note/comments/use-add-comment";
import useGetNoteComments from "@/hooks/project-modules/note/comments/use-get-note-comments";
import { NoteDetails } from "@/types/api.types";
import { addNoteCommentSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CommentCard from "../components/cards/comment-card";

function NoteCommentSection({ note }: { note: NoteDetails }) {
  const noteComments = useGetNoteComments(note.project_id, note.id);
  const addComment = useAddComment(note.project_id, note.id);

  const form = useForm<z.infer<typeof addNoteCommentSchema>>({
    resolver: zodResolver(addNoteCommentSchema),
  });

  const renderBody = () => {
    if (noteComments.isPending)
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

    if (noteComments?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (noteComments?.value?.data?.length === 0)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">No comment on this note yet</p>
        </div>
      );

    return (
      <div className="space-y-2">
        {noteComments?.value?.data?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    );
  };

  const onSubmit = async (data: z.infer<typeof addNoteCommentSchema>) => {
    addComment
      .mutateAsync(data)
      .then(() => {
        noteComments.refetch().then(() => {
          form.reset();
        });
      })
      .catch(console.error);
  };

  return (
    <>
      <div className="space-y-4 animate-in fade-in-0 duration-700 ease-in-out">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Leave a comment"
                      {...field}
                      disabled={addComment.isPending || noteComments.isRefetching}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div>{renderBody()}</div>
      </div>
    </>
  );
}

export default NoteCommentSection;
