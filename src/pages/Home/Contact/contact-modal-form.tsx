import Modal from "@/components/Modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultiSelect from "@/components/ui/multi-select";
import useGetCompanyUsers from "@/hooks/company-admin/use-get-company-users";
import useCreateContact from "@/hooks/contacts/use-create-contact";
import useUpdateContact from "@/hooks/contacts/use-update-contact";
import getInitials from "@/lib/utils";
import { getUserSession } from "@/services/api.service";
import { ContactFormValues } from "@/types/contact.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import * as yup from "yup";

// Define contact schema
const contactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-phone", "Invalid phone number", (value) => {
      return value ? isValidPhoneNumber(value) : false;
    }),
  assigned_to: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
      })
    )
    .min(1, "Assign this contact to at least one person")
    .required("Assign this contact to at least one person"),
});

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  contactData?: ContactFormValues;
}

function ContactModal({ isOpen, onClose, mode, contactData }: ContactModalProps) {
  // Get data from hooks
  const session = getUserSession();
  const usersResponse = useGetCompanyUsers();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact(contactData?.id || "");

  const form = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      assigned_to: [],
    },
    mode: "onChange",
  });

  const { isDirty } = form.formState;

  // Load data for edit or view mode
  useEffect(() => {
    if (contactData && (mode === "edit" || mode === "view")) {
      form.reset(contactData);
    }
  }, [contactData, form, mode]);

  const users = Array.isArray(usersResponse?.value?.data) ? usersResponse.value.data : [];

  // Convert users to MultiSelect options format
  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name || user.email,
  }));

  const onSubmit = async (data: ContactFormValues) => {
    // Prepare the payload with consistent structure

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company_id: session?.company_id ?? "",
      assigned_to: data.assigned_to.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    };

    if (mode === "create") {
      createContact
        .mutateAsync(payload)
        .then(() => {
          onClose();
          form.reset();
        })
        .catch(console.error);
    } else if (mode === "edit") {
      updateContact
        .mutateAsync({
          ...payload,
        })
        .then(() => {
          onClose();
        })
        .catch(console.error);
    }
  };

  return (
    <Modal
      title={
        mode === "create"
          ? "Add contact"
          : mode === "edit"
            ? "Edit contact"
            : "View contact"
      }
      closeModal={onClose}
      isOpen={isOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} disabled={mode === "view"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    disabled={mode === "view"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    disabled={mode === "view"}
                    className={`
            [&>input]:bg-background
            [&>input]:rounded-full
            [&>input]:border
            [&>input]:h-12
            [&>input]:px-4
            [&>input]:py-2
          `}
                    inputRef={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Assign to</FormLabel>
                <FormControl>
                  <div>
                    <MultiSelect
                      options={userOptions}
                      defaultSelected={field.value?.map((user) => user.id) || []}
                      onChange={(selectedIds) => {
                        const selectedUsers = users
                          .filter((user) => selectedIds.includes(user.id))
                          .map((user) => ({
                            id: user.id,
                            name: user.name || user.email,
                          }));
                        field.onChange(selectedUsers);
                      }}
                      placeholder="Assign to"
                      disabled={mode === "view"}
                      error={fieldState.error?.message}
                    />

                    {/* Display selected users as pills */}
                    {mode === "view" && field.value?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center bg-gray-200 rounded-full px-3 py-1"
                          >
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarFallback className="text-xs">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          {mode !== "view" && (
            <div className="pt-3">
              <Button
                type="submit"
                className="w-full"
                isLoading={createContact.isPending || updateContact.isPending}
                disabled={mode === "edit" && !isDirty}
              >
                {mode === "create" ? "Add contact" : "Save changes"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </Modal>
  );
}

export default ContactModal;
