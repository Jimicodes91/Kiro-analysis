import { FormControl } from "@/components/ui/form";
import CustomMultiSelect from "@/components/ui/multi-lol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetCompanyContacts from "@/hooks/contacts/use-get-company-contact";
import useGetAllProjectTypes from "@/hooks/project-modules/project-types/use-get-all-project-types";
import React, { useEffect } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface SelectComponentProps {
  apiLocator: "journey-list" | "contact-list";
  name: string;
  isMultiple: 1 | 0;
  fieldProps: ControllerRenderProps<object, never>;
}

type Option = {
  id: string;
  name: string;
};
function SelectComponent({
  apiLocator,
  name,
  isMultiple,
  fieldProps,
}: SelectComponentProps) {
  const projectTypes = useGetAllProjectTypes();
  const contactList = useGetCompanyContacts();

  const [options, setOptions] = React.useState<Option[]>([]);

  useEffect(() => {
    const getService = () => {
      if (projectTypes?.value && contactList?.value) {
        switch (apiLocator) {
          case "journey-list": {
            const journeyOption = projectTypes?.value?.data?.map((item) => ({
              id: item.id,
              name: item.name,
            }));
            setOptions(journeyOption);
            return;
          }

          case "contact-list": {
            const contactOption = contactList?.value?.data?.contacts?.map((item) => ({
              id: item.id,
              name: item.name,
            }));
            setOptions(contactOption);
            return;
          }

          default:
            return;
        }
      }
    };

    getService();
  }, [apiLocator, projectTypes?.value, contactList?.value]);

  if (isMultiple === 1) {
    return (
      <CustomMultiSelect
        options={options?.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onChange={fieldProps.onChange}
        value={fieldProps.value}
        placeholder={`Select ${name}`}
        isMulti
      />
    );
  }
  return (
    <Select onValueChange={fieldProps.onChange} defaultValue={fieldProps.value}>
      <FormControl className="h-12">
        <SelectTrigger className="rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm">
          <SelectValue
            placeholder={<p className="text-brand-placeholder">{`Select ${name}`}</p>}
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
  );
}

export default SelectComponent;
