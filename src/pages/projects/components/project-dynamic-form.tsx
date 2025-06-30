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
import { Textarea } from "@/components/ui/textarea";
import { IFormField } from "@/hooks/project-modules/project-forms/use-get-project-form-fields";
import useCreateProject from "@/hooks/project-modules/use-create-project";
import { PAGES } from "@/lib/constants";
import { cn, convertDatesToYMD, getSelectableDate } from "@/lib/utils";
import { useProjectContext } from "@/pages/Home/Project/context/project-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import SelectComponent from "./lol";

export default function CreateProjectDynamicForm({ fields }: { fields: IFormField[] }) {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const { changeActiveProjectType } = useProjectContext();

  const fieldSchema = fields.reduce((acc, field) => {
    const key = field.slug;
    let validator:
      | z.ZodString
      | z.ZodNumber
      | z.ZodDate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | z.ZodArray<any>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | z.ZodEffects<any> = z.string({
      message: `${field.name} is required`,
    }); // Explicitly declare the type

    if (field.type === "number") {
      validator = z.coerce.number({
        message: "Please input a number",
      });
      if (field.is_required)
        validator = validator.min(1, `${field.name} must be at least 1`);
    } else if (field.type === "date") {
      validator = z.coerce.string();
      if (field.is_required) {
        validator = z.coerce.date();
        if (field.slug === "end_date") {
          validator = validator.min(new Date(), `${field.name} must be a valid date`);
        }
      }
    } else if (field.slug === "project_client") {
      validator = z
        .array(
          z
            .object({
              label: z.string(),
              value: z.string(),
            })
            .required()
        )
        .refine((val) => (val && val.length === 0 ? false : true), {
          message: "Client is required",
        });
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
        if ("journey" in values) changeActiveProjectType(values?.journey as string);
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
                  const isRequired = Boolean(field.is_required);
                  return (
                    <FormField
                      key={field.name}
                      control={form.control}
                      // @ts-expect-error: TypeScript cannot infer the type of the dynamic field name
                      name={field.slug}
                      render={({ field: fieldProps }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>
                            {field.name}{" "}
                            {isRequired && (
                              <span className="text-red-600 font-bold">*</span>
                            )}
                          </FormLabel>
                          <>
                            {field.type === "select" ? (
                              <SelectComponent
                                // @ts-expect-error Type error
                                apiLocator={field.api_locator}
                                fieldProps={fieldProps}
                                isMultiple={field.is_multiple}
                                name={field.name}
                              />
                            ) : field.type === "date" ? (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      rightIcon={
                                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                      }
                                      disabled={
                                        field.slug === "end_date"
                                          ? // @ts-expect-error Date issue
                                            !form.watch("start_date")
                                          : false
                                      }
                                      variant={"outline"}
                                      className={cn(
                                        "flex w-full justify-stretch h-12  font-normal rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm",
                                        !fieldProps.value && "text-muted-foreground"
                                      )}
                                      slotClassName="justify-start"
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
                                    disabled={
                                      field.slug === "end_date"
                                        ? // @ts-expect-error Date issue
                                          (value) => value < form.watch("start_date")
                                        : getSelectableDate
                                    }
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
