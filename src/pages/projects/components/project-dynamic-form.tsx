import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
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
import { IFormField } from "@/hooks/project-modules/project-forms/use-get-project-form-fields";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import useCreateProject from "@/hooks/project-modules/use-create-project";
import { PAGES } from "@/lib/constants";
import { cn, convertDatesToYMD } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

export default function CreateProjectDynamicForm({ fields }: { fields: IFormField[] }) {
  const projectTypes = useGetAllProjectTypes();
  const navigate = useNavigate();
  const createProject = useCreateProject();

  const fieldSchema = fields.reduce((acc, field) => {
    const key = field.slug;
    let validator: z.ZodString | z.ZodNumber | z.ZodDate = z.string({
      message: `${field.name} is required`,
    }); // Explicitly declare the type

    if (field.type === "number") {
      validator = z.coerce.number({
        message: "Please input a number",
      });
      if (field.is_required)
        validator = validator.min(1, `${field.name} must be at least 1`);
    } else if (field.type === "date") {
      validator = z.coerce.date();
      if (field.is_required)
        validator = validator.min(new Date(), `${field.name} must be a valid date`);
    } else {
      if (field.is_required) validator = validator.min(1, `${field.name} is required`);
    }

    return { ...acc, [key]: validator };
  }, {});

  const formSchema = z.object(fieldSchema);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () => fields.reduce((acc, field) => ({ ...acc, [field.slug]: "" }), {}),
      [fields]
    ),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProject
      .mutateAsync(convertDatesToYMD(values))
      .then(() => {
        form.reset();
        navigate(PAGES.PROJECT_PAGE);
      })
      .catch(console.error);
  }
  return (
    <div className="bg-white rounded-lg p-4 max-w-lg w-full">
      <div className="border rounded-lg">
        <div className="w-full mx-auto space-y-1">
          <div className="px-3 pt-2">
            <Heading size="h3">Add Project</Heading>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-3 py-3 space-y-4">
              {fields
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((field) => {
                  const options = projectTypes?.value?.data ?? [];

                  return (
                    <FormField
                      key={field.name}
                      control={form.control}
                      // @ts-expect-error: TypeScript cannot infer the type of the dynamic field name
                      name={field.slug}
                      render={({ field: fieldProps }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>{field.name}</FormLabel>
                          <>
                            {field.type === "select" ? (
                              <Select
                                key={projectTypes?.status}
                                onValueChange={fieldProps.onChange}
                                defaultValue={fieldProps.value}
                              >
                                <FormControl className="h-12">
                                  <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
                                    <SelectValue
                                      placeholder={
                                        <p className="text-brand-placeholder">{`Select ${field.name}`}</p>
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                  {options?.map((option, idx) => (
                                    <SelectItem key={idx} value={option.id}>
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === "date" ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      rightIcon={
                                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                      }
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 !justify-between flex w-full font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm",
                                        !fieldProps.value && "text-muted-foreground"
                                      )}
                                    >
                                      {fieldProps.value ? (
                                        format(fieldProps.value, "yyy-MM-dd")
                                      ) : (
                                        <span className="text-brand-placeholder">
                                          Pick a date
                                        </span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={fieldProps.value}
                                    onSelect={fieldProps.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : field.slug === "description" ? (
                              <FormControl>
                                <Textarea
                                  placeholder={`Enter ${field.name}`}
                                  {...fieldProps}
                                />
                              </FormControl>
                            ) : (
                              <FormControl>
                                <Input
                                  type={field.type}
                                  placeholder={`Enter ${field.name}`}
                                  {...fieldProps}
                                />
                              </FormControl>
                            )}
                          </>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              <div className="pt-5">
                <Button type="submit" fullWidth isLoading={createProject.isPending}>
                  Add project
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
