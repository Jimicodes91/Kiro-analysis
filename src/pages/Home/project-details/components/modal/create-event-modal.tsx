import { ModalProps } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useGetAllEventTypes from "@/hooks/project-modules/event-types/use-get-all-event-types";
import useCreateEvent from "@/hooks/project-modules/events/use-create-event";
import { cn } from "@/lib/utils";
import { addProjectEventSchema } from "@/utils/validation-schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../../../../../components/Modal";

const statuses = [
  { value: "in_progress", label: "In Progress" },
  { value: "pending", label: "Pending" },
];
const CreateEventModal = ({
  onClose,
  projectId,
  isOpen,
}: {
  projectId: string;
} & ModalProps) => {
  const createEvent = useCreateEvent(projectId);
  const eventTypes = useGetAllEventTypes();
  const form = useForm<z.infer<typeof addProjectEventSchema>>({
    resolver: zodResolver(addProjectEventSchema),
  });

  const onSubmit = async (data: z.infer<typeof addProjectEventSchema>) => {
    createEvent
      // @ts-expect-error ssls
      .mutateAsync(data)
      .then(() => {
        form.reset();
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <Modal title="Create event" closeModal={onClose} isOpen={isOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger
                        isLoading={eventTypes.isLoading}
                        className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
                      >
                        <SelectValue
                          placeholder={
                            <p className="text-brand-placeholder">Select Event type</p>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes?.value?.data?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Start date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-sm h-12 font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4",
                            !field.value && "text-muted-foreground"
                          )}
                          slotClassName="justify-start"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-brand-placeholder">Start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Time"
                        className="flex justify-between"
                        type="time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>To</FormLabel>
                    <FormControl className="w-full">
                      <Input placeholder="Event title" type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl className="h-12 w-full">
                      <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                        <SelectValue
                          placeholder={
                            <p className="text-brand-placeholder">Select status</p>
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses?.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_visible_to_client"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal text-brand-fade">
                    Make visible to client
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={createEvent.isPending}>
              Create Event
            </Button>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default CreateEventModal;
