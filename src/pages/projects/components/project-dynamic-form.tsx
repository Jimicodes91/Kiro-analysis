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
import { useOrgProjectContext } from "@/pages/Home/Project/context/org-project-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";
import { CountrySelect } from "react-country-state-city";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import SelectComponent from "./lol";

export default function CreateProjectDynamicForm({ fields }: { fields: IFormField[] }) {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const { changeActiveProjectType } = useOrgProjectContext();

  const validFields = useMemo(() => fields?.filter((field) => field?.slug), [fields]);

  const fieldSchema = validFields?.reduce((acc, field) => {
    const key = field.slug;
    let validator: z.ZodTypeAny;

    if (field.type === "number") {
      const numValidator = z.coerce.number({
        message: "Please input a number",
      });
      validator = field.is_required
        ? numValidator.min(1, `${field.name} must be at least 1`)
        : numValidator.optional();
    } else if (field.type === "date") {
      if (field.is_required) {
        const dateValidator = z.coerce.date();
        validator =
          field.slug === "end_date"
            ? dateValidator.min(new Date(), `${field.name} must be a valid date`)
            : dateValidator;
      } else {
        validator = z.coerce.string().optional();
      }
    } else if (field.slug === "project_client") {
      const arrayValidator = z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
        { invalid_type_error: "Client is required" }
      );
      validator = field.is_required
        ? arrayValidator.min(1, "Client is required")
        : arrayValidator.optional();
    } else if (field.slug === "nationality" || field.slug === "resident_country") {
      const objectValidator = z.object(
        {
          id: z.number(),
          name: z.string(),
          iso3: z.string(),
          iso2: z.string(),
          numeric_code: z.string(),
          phone_code: z.string(),
          capital: z.string(),
          currency: z.string(),
          currency_name: z.string(),
          currency_symbol: z.string(),
          tld: z.string(),
          native: z.string(),
          region: z.string(),
          subregion: z.string(),
          latitude: z.string(),
          longitude: z.string(),
          emoji: z.string(),
          hasStates: z.boolean(),
        },
        { invalid_type_error: `${field.name} is required` }
      );
      validator = field.is_required ? objectValidator : objectValidator.optional();
    } else {
      const strValidator = z.string({ message: `${field.name} is required` });
      validator = field.is_required
        ? strValidator.min(1, `${field.name} is required`)
        : strValidator.optional();
    }

    return { ...acc, [key]: validator };
  }, {});

  const formSchema = z.object(fieldSchema);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(
      () =>
        validFields.reduce((acc, field) => {
          let defaultValue: unknown = "";
          if (field.slug === "project_client") {
            defaultValue = [];
          } else if (field.slug === "nationality" || field.slug === "resident_country") {
            defaultValue = undefined;
          }
          return { ...acc, [field.slug]: defaultValue };
        }, {}),
      [validFields]
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
              {validFields
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
                          <FormLabel isRequired={isRequired}>{field.name} </FormLabel>
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
                            ) : field.slug === "nationality" ||
                              field.slug === "resident_country" ? (
                              <CountrySelect
                                containerClassName="focus-visible:outline-none focus-visible:ring-1! focus-visible:ring-ring! shadow-sm"
                                inputClassName="flex h-20! w-full rounded-full! placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:focus:border-black disabled:focus:bg-white disabled:opacity-50 md:text-sm"
                                onChange={(_country) => {
                                  fieldProps.onChange(_country);
                                }}
                                placeHolder="Select Country"
                              />
                            ) : field.slug === "project_value" ? (
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    className="pl-7"
                                    placeholder={`Enter ${field.name}`}
                                    min={0}
                                    {...fieldProps}
                                  />
                                </div>
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
