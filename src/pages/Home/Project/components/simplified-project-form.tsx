import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
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
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useCreateSimplifiedProject from "@/hooks/project-modules/use-create-simplified-project";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const simplifiedProjectSchema = yup.object({
  name: yup.string().required("Project name is required"),
  project_type_id: yup.string().required("Journey is required"),
  start_date: yup.date().required("Start date is required").typeError("Please select a valid date"),
  client_email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Client email is required"),
  client_phone: yup.string().required("Client phone number is required"),
  client_name: yup.string().optional(),
  project_value: yup.number().positive("Must be a positive number").optional().nullable().transform((value, originalValue) => originalValue === "" ? null : value),
  nationality: yup.string().optional(),
  notes: yup.string().optional(),
  send_client_invite: yup.boolean().optional(),
  invite_message: yup.string().optional(),
});

type SimplifiedProjectFormData = yup.InferType<typeof simplifiedProjectSchema>;

interface SimplifiedProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SimplifiedProjectForm({
  onSuccess,
  onCancel,
}: SimplifiedProjectFormProps) {
  const projectTypes = useGetAllProjectTypes();
  const createProject = useCreateSimplifiedProject();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<SimplifiedProjectFormData>({
    resolver: yupResolver(simplifiedProjectSchema),
    mode: "onSubmit", // Only validate on submit
    defaultValues: {
      name: "",
      project_type_id: "",
      start_date: undefined,
      client_email: "",
      client_phone: "",
      client_name: "",
      project_value: undefined,
      nationality: "",
      notes: "",
      send_client_invite: false,
      invite_message: "",
    },
  });

  const onSubmit = async (data: SimplifiedProjectFormData) => {
    try {
      console.log("Form data being submitted:", data);
      
      // Backend validates fields at root level using validateFormFields method
      // All fields must be at root with their database slug names
      const payload: any = {
        // Required fields (from database: is_required=1)
        project_name: data.name,
        journey: data.project_type_id,
        start_date: data.start_date ? format(data.start_date, "yyyy-MM-dd") : "",
        client_organization: "N/A", // Required by database but deprecated
        
        // Optional fields
        client_email: data.client_email,
        client_phone: data.client_phone,
        client_name: data.client_name || null,
        project_value: data.project_value || null,
        nationality: data.nationality || null,
        notes: data.notes || null,
        
        // Optional invite fields
        send_client_invite: data.send_client_invite || false,
        invite_message: data.invite_message || null,
      };

      console.log("Payload being sent to API:", payload);

      await createProject.mutateAsync(payload);
      
      toast.success("Project created successfully");
      
      if (onSuccess) {
        onSuccess();
      }
      
      form.reset();
    } catch (error: any) {
      console.error("Project creation error:", error);
      const errorMessage = error?.response?.data?.message || "Failed to create project";
      toast.error(errorMessage);
    }
  };

  const sendInvite = form.watch("send_client_invite");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Project Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Project Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Type */}
        <FormField
          control={form.control}
          name="project_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Journey <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select journey" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projectTypes.isSuccess &&
                    projectTypes.value?.data?.map((type: any) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Start Date <span className="text-red-500">*</span>
              </FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Email */}
        <FormField
          control={form.control}
          name="client_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Client Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="client@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                If contact exists, we'll link to them. Otherwise, we'll create a new
                contact.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Phone */}
        <FormField
          control={form.control}
          name="client_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Client Phone <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Client Name (Optional) */}
        <FormField
          control={form.control}
          name="client_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                If not provided, we'll extract from email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Value (Optional) */}
        <FormField
          control={form.control}
          name="project_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Value (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10000"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality (Optional) */}
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes (Optional) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional project notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Send Client Invite */}
        <FormField
          control={form.control}
          name="send_client_invite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Send client invitation</FormLabel>
                <FormDescription>
                  Invite the client to access the platform
                  {form.watch("send_client_invite") &&
                    " (requires admin approval if you're a consultant)"}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Invite Message (Conditional) */}
        {sendInvite && (
          <FormField
            control={form.control}
            name="invite_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invitation Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Custom message for the invitation email..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
