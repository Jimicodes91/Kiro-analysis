// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";

// import Modal from "@/components/Modal";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Checkbox } from "@/components/ui/checkbox";
// import DragNdrop from "@/components/ui/file-upload";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import MultiSelect from "@/components/ui/multi-select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { cn, fileToBase64, getSelectableDate, getUTCISODateFormat } from "@/lib/utils";
// import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
// import useGetAllTaskTypes from "@/hooks/project-modules/task-types/use-get-all-task-types";
// import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
// import useGetAllProjects from "@/hooks/project-modules/use-get-all-projects";
// import useUpdateProjectTask from "@/hooks/project-modules/tasks/use-update-project-task";

// // Status options for the dropdown
// const statuses = [
//   { value: "in_progress", label: "In Progress" },
//   { value: "pending", label: "Pending" },
//   { value: "completed", label: "Completed" },
// ];

// // File validation constants
// const FILE_SIZE = 5 * 1024 * 1024; // 5MB
// const ALLOWED_FILE_TYPES = [
//   "application/pdf",
//   "image/png",
//   "image/jpeg",
//   "application/msword",
// ];

// // Validation schema using Yup
// const editTaskSchema = yup.object({
//   name: yup
//     .string()
//     .required("Task name is required")
//     .min(3, "Task name must be at least 3 characters"),
//   task_type_id: yup.string().required("Task type is required"),
//   project_type_id: yup.string().required("Pipeline is required"),
//   project_id: yup.string().required("Project is required"),
//   status: yup
//     .string()
//     .oneOf(["in_progress", "pending", "completed"], "Invalid status")
//     .required("Status is required"),
//   description: yup.string().required("Description is required"),
//   start_date: yup.date().required("Start date is required"),
//   end_date: yup.date().required("End date is required"),
//   is_visible_to_client: yup.boolean().default(false),
//   // Validate assignees as an array of strings
//   assignees: yup
//     .array()
//     .of(yup.string().required())
//     .min(1, "At least one assignee is required")
//     .required("Assignees are required"),
//   // Attachment is now required with file validation
//   attachment: yup
//     .mixed()
//     .test("required", "An attachment is required", function (value) {
//       // Check if we have existing attachments from task (used in useEffect)
//       const hasExistingAttachments = this.parent.has_existing_attachments;

//       // If there are existing attachments, no need for a new one
//       if (hasExistingAttachments) return true;

//       // Otherwise, require a new attachment
//       return value && value.size > 0;
//     })
//     .test("fileSize", "File must be less than 5MB", function (value) {
//       if (!value) return this.parent.has_existing_attachments || false;
//       return value.size <= FILE_SIZE;
//     })
//     .test("fileType", "Only PDF, PNG, JPG, and DOC files are allowed", function (value) {
//       if (!value) return this.parent.has_existing_attachments || false;
//       return ALLOWED_FILE_TYPES.includes(value.type);
//     })
//     .nullable(),
//   // Hidden field to track if there are existing attachments
//   has_existing_attachments: yup.boolean().default(false),
// });

// const EditTaskModal = ({
//   onClose,
//   isOpen,
//   task,
// }) => {
//   const [formInitialized, setFormInitialized] = useState(false);

//   const taskTypes = useGetAllTaskTypes();
//   const projectTypes = useGetAllProjectTypes();
//   const users = useGetCompanyUsers();

//   const form = useForm({
//     resolver: yupResolver(editTaskSchema),
//     defaultValues: {
//       name: "",
//       task_type_id: "",
//       project_type_id: "",
//       project_id: "",
//       description: "",
//       status: "",
//       start_date: null,
//       end_date: null,
//       is_visible_to_client: false,
//       assignees: [],
//       attachment: null,
//     },
//   });

//   // Watch project_type_id to fetch related projects
//   const selectedProjectTypeId = form.watch("project_type_id");
//   const projects = useGetAllProjects(selectedProjectTypeId);

//   // Watch project_id to determine which updateTask hook to use
//   const selectedProjectId = form.watch("project_id");
//   const updateTask = useUpdateProjectTask(selectedProjectId, task?.id);

//   // Initialize form with task data when it becomes available
//   useEffect(() => {
//     if (task && isOpen && !formInitialized && projectTypes.value?.data && taskTypes.value?.data) {
//       // First set the project type to ensure projects are loaded
//       form.setValue("project_type_id", task.project_type_id || "");

//       // Check if task has existing attachments
//       const hasExistingAttachments = task.attachments && task.attachments.length > 0;

//       // Use a small delay to ensure the projects have loaded
//       setTimeout(() => {
//         form.reset({
//           name: task.name || "",
//           task_type_id: task.task_type_id || "",
//           project_type_id: task.project_type_id || "",
//           project_id: task.project_id || "",
//           description: task.description || "",
//           status: task.status || "",
//           start_date: task.start_date ? new Date(task.start_date) : null,
//           end_date: task.end_date ? new Date(task.end_date) : null,
//           is_visible_to_client: task.is_visible_to_client === 1 ? true : false,
//           // Convert assignees to simple array of IDs
//           assignees: task?.assignees?.map((item) => item.id) || [],
//           attachment: null, // Initialize to null as we're not editing existing attachments
//           has_existing_attachments: hasExistingAttachments,
//         });

//         setFormInitialized(true);
//       }, 100);
//     }
//   }, [task, isOpen, formInitialized, projectTypes.value?.data, taskTypes.value?.data, form]);

//   // Reset form initialization when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setFormInitialized(false);
//     }
//   }, [isOpen]);

//   const onSubmit = async (data) => {
//     const { assignees, end_date, start_date, attachment, has_existing_attachments, ...validData } = data;

//     // Process attachment if exists
//     let base64File = null;
//     if (attachment) {
//       try {
//         base64File = await fileToBase64(attachment);
//       } catch (err) {
//         console.error("Error converting file:", err);
//       }
//     }

//     // We're directly passing assignee IDs now
//     const payload = {
//       ...validData,
//       start_date: getUTCISODateFormat(start_date),
//       end_date: getUTCISODateFormat(end_date),
//       assignees: assignees,
//     };

//     // Only add attachment to payload if it exists
//     if (base64File) {
//       payload.attachment = base64File;
//     }

//     try {
//       await updateTask.mutateAsync(payload);
//       form.reset();
//       onClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Modal
//       title="Edit Task"
//       closeModal={onClose}
//       isOpen={isOpen}
//       closeOnEsc={false}
//       closeOnOverlayClick={false}
//     >
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="flex flex-col gap-4 p-4"
//         >
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Task name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Task name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="task_type_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Task type</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl className="h-12 w-full">
//                     <SelectTrigger
//                       isLoading={taskTypes.isLoading}
//                       className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
//                     >
//                       <SelectValue
//                         placeholder={<p className="text-brand-placeholder">Select Task type</p>}
//                       />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {taskTypes?.value?.data?.map((item) => (
//                       <SelectItem key={item.id} value={item.id}>
//                         {item.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="project_type_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Pipeline</FormLabel>
//                 <Select
//                   onValueChange={(value) => {
//                     field.onChange(value);
//                     // Clear project selection when pipeline changes
//                     if (value !== field.value) {
//                       form.setValue("project_id", "");
//                     }
//                   }}
//                   defaultValue={field.value}
//                 >
//                   <FormControl className="h-12 w-full">
//                     <SelectTrigger
//                       isLoading={projectTypes.isLoading}
//                       className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
//                     >
//                       <SelectValue
//                         placeholder={<p className="text-brand-placeholder">Select Pipeline</p>}
//                       />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {projectTypes?.value?.data?.map((item) => (
//                       <SelectItem key={item.id} value={item.id}>
//                         {item.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="project_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Project</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                   disabled={!selectedProjectTypeId}
//                 >
//                   <FormControl className="h-12 w-full">
//                     <SelectTrigger
//                       isLoading={projects.isLoading}
//                       className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm"
//                     >
//                       <SelectValue
//                         placeholder={
//                           <p className="text-brand-placeholder">
//                             {selectedProjectTypeId ? "Select Project" : "Select Pipeline first"}
//                           </p>
//                         }
//                       />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {projects?.value?.data
//                       ?.filter(project => project.project_type_id === selectedProjectTypeId)
//                       .map((item) => (
//                         <SelectItem key={item.id} value={item.id}>
//                           {item.name}
//                         </SelectItem>
//                       ))}
//                     {projects?.value?.data?.filter(project =>
//                       project.project_type_id === selectedProjectTypeId).length === 0 && (
//                       <div className="px-2 py-2 text-center text-[#00000099]">
//                         No projects found for this pipeline
//                       </div>
//                     )}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="Description" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex gap-4 justify-between">
//             <FormField
//               control={form.control}
//               name="start_date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col w-full">
//                   <FormLabel>Start date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "text-sm h-12 font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4",
//                             !field.value && "text-muted-foreground"
//                           )}
//                           slotClassName="justify-start"
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span className="text-brand-placeholder">Start date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={getSelectableDate}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="end_date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col w-full">
//                   <FormLabel>End date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "font-normal h-12 rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span className="text-brand-placeholder">End date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => !form.watch("start_date") || date < new Date(form.watch("start_date"))}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="status"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Status</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl className="h-12 w-full">
//                     <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
//                       <SelectValue
//                         placeholder={<p className="text-brand-placeholder">Select status</p>}
//                       />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {statuses?.map((item) => (
//                       <SelectItem key={item.value} value={item.value}>
//                         {item.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="assignees"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <FormLabel>Assignee (Required)</FormLabel>
//                 <FormControl>
//                   <MultiSelect
//                     options={
//                       users?.value
//                         ? users?.value?.data?.map((item) => ({
//                             label: item.name ?? item.email,
//                             value: item.id,
//                           }))
//                         : []
//                     }
//                     defaultSelected={field.value}
//                     onChange={field.onChange}
//                     placeholder="Select Assignee"
//                     error={fieldState.error?.message}
//                     disabled={users.isPending}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name={"attachment"}
//             render={({ field, fieldState }) => {
//               const hasExistingAttachments = form.getValues("has_existing_attachments");
//               return (
//                 <FormItem>
//                   <FormLabel>
//                     {hasExistingAttachments ? "New Attachment (Optional)" : "Attachment (Required)"}
//                   </FormLabel>
//                   <FormControl>
//                     <DragNdrop
//                       id="file-attachment"
//                       value={field.value ? [field.value] : []}
//                       onChange={(files) => field.onChange(files[0] || null)}
//                     />
//                   </FormControl>
//                   {hasExistingAttachments && (
//                     <p className="text-xs text-[#00000099] mt-1">
//                       Task already has attachments. Uploading a new file will add to existing attachments.
//                     </p>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               );
//             }}
//           />

//           <FormField
//             control={form.control}
//             name="is_visible_to_client"
//             render={({ field }) => (
//               <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                 <FormControl>
//                   <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                 </FormControl>
//                 <FormLabel className="font-normal text-[#00000099]">
//                   Make visible to client
//                 </FormLabel>
//               </FormItem>
//             )}
//           />

//           <Button type="submit" isLoading={updateTask.isPending} className="w-full">
//             Update Task
//           </Button>
//         </form>
//       </Form>
//     </Modal>
//   );
// };

// export default EditTaskModal;
