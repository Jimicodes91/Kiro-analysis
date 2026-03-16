import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import useCreateContact from "@/hooks/contacts/use-create-contact";
import useUpdateContact from "@/hooks/contacts/use-update-contact";
import { getUserSession } from "@/services/api.service";
import { ContactFormValues } from "@/types/contact.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
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
  organization: yup.string().optional(),
  address: yup.string().optional(),
  send_invite_immediately: yup.boolean().optional(),
  invite_message: yup.string().optional(),
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
  const createContact = useCreateContact();
  const updateContact = useUpdateContact(contactData?.id || "");

  const form = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      address: "",
      assigned_to: [],
      send_invite_immediately: false,
      invite_message: "",
    },
    mode: "onChange",
  });

  const { isDirty } = form.formState;
  const sendInviteImmediately = form.watch("send_invite_immediately");

  // Load data for edit or view mode
  useEffect(() => {
    if (contactData && (mode === "edit" || mode === "view")) {
      form.reset(contactData);
    }
  }, [contactData, form, mode]);

  const onSubmit = async (data: ContactFormValues) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      organization: data.organization,
      address: data.address,
      company_id: session?.company_id ?? "",
      workspace_id: session?.workspace_id ?? "",
      assigned_to: data.assigned_to?.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      send_invite_immediately: data.send_invite_immediately,
      invite_message: data.invite_message,
    };

    if (mode === "create") {
      createContact
        .mutateAsync(payload)
        .then((response) => {
          // Check if invite was sent or requires approval
          if (response.invite) {
            if (response.invite.requires_approval) {
              toast.success("Contact created! Invite request sent to admins for approval.");
            } else {
              toast.success("Contact created and invitation sent successfully!");
            }
          } else {
            toast.success("Contact created successfully!");
          }
          onClose();
          form.reset();
        })
        .catch((error) => {
          toast.error(error.message || "Failed to create contact");
        });
    } else if (mode === "edit") {
      updateContact
        .mutateAsync({
          ...payload,
          assigned_to: payload.assigned_to || [],
        })
        .then(() => {
          toast.success("Contact updated successfully!");
          onClose();
        })
        .catch((error) => {
          toast.error(error.message || "Failed to update contact");
        });
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
            [&>input]:text-sm
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
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Organization"
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address"
                    {...field}
                    disabled={mode === "view"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === "create" && (
            <>
              <FormField
                control={form.control}
                name="send_invite_immediately"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Send invitation immediately
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Invite this contact to join the platform as a client
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {sendInviteImmediately && (
                <FormField
                  control={form.control}
                  name="invite_message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom invitation message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a personal message to the invitation..."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}

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
