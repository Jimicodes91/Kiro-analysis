import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Event, EventFormData } from "@/types/event.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view" | "edit";
  event?: Event;
}

const eventSchema = yup.object({
  eventTitle: yup.string().required("Event title is required"),
  eventType: yup.string().required("Event type is required"),
  projectType: yup.string().required("Project type is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  venue: yup.string().required("Venue is required"),
  description: yup.string().required("Description is required"),
  sendTo: yup.string().required("Send to field is required"),
  // visibleToClient: yup.boolean().default(false),
});

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, mode, event }) => {
  const [loading, setLoading] = useState(false);
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";

  const { control, handleSubmit, reset, setValue } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      eventTitle: "",
      eventType: "",
      projectType: "",
      date: "",
      time: "",
      venue: "",
      description: "",
      sendTo: "",
      // visibleToClient: false,
    },
  });

  useEffect(() => {
    if (event && (mode === "edit" || mode === "view")) {
      // Populate form with event data
      setValue("eventTitle", event.eventTitle);
      setValue("eventType", event.eventType || "");
      setValue("projectType", event.projectType || "");
      setValue("date", event.date);
      setValue("time", event.time || "");
      setValue("venue", event.venue || "");
      setValue("description", event.description || "");
      setValue("sendTo", event.sendTo || "");
      // setValue("visibleToClient", event.visibleToClient || false);
    }
  }, [event, mode, setValue]);

  const handleFormSubmit = async (data: EventFormData) => {
    if (isViewMode) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      if (mode === "edit" && event?.id) {
        data.id = event.id;
      }

      if (mode === "edit") {
        // await updateEvent(data);
        console.log("Updating event:", data);
      } else if (mode === "create") {
        // await createEvent(data);
        console.log("Creating event:", data);
      }

      onClose();
      reset();
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={isCreateMode ? "Create event" : isViewMode ? "View event" : "Edit event"}
      closeModal={onClose}
      // fullHeight={true}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event title
          </label>
          <Controller
            name="eventTitle"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  disabled={isViewMode}
                  placeholder="Event title"
                  className={isViewMode ? "bg-gray-100" : ""}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event type
          </label>
          <Controller
            name="eventType"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={isViewMode ? "bg-gray-100" : ""}>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project type
          </label>
          <Controller
            name="projectType"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={isViewMode ? "bg-gray-100" : ""}>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Controller
              name="date"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    type="date"
                    disabled={isViewMode}
                    className={isViewMode ? "bg-gray-100" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <Controller
              name="time"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    type="time"
                    disabled={isViewMode}
                    className={isViewMode ? "bg-gray-100" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
          <Controller
            name="venue"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  disabled={isViewMode}
                  placeholder="Venue"
                  className={isViewMode ? "bg-gray-100" : ""}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  disabled={isViewMode}
                  placeholder="Description"
                  className={`min-h-24 ${isViewMode ? "bg-gray-100" : ""}`}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Send to</label>
          <Controller
            name="sendTo"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  disabled={isViewMode}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={isViewMode ? "bg-gray-100" : ""}>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="clients">Clients</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        {/* <div className="flex items-center space-x-2">
          <Controller
            name="visibleToClient"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="visibleToClient"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isViewMode}
              />
            )}
          />
          <label
            htmlFor="visibleToClient"
            className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Make visible to client
          </label>
        </div> */}

        <div className="pt-4 border-t">
          <Button type="submit" className="w-full" disabled={loading || isViewMode}>
            {isCreateMode ? "Create event" : isViewMode ? "Close" : "Update event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;
