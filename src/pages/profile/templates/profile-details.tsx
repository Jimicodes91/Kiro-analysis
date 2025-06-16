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
import useUpdateProfile from "@/hooks/user/use-update-profile";
import { getUserSession, updateUserSession } from "@/services/api.service";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import * as yup from "yup";

const editProfileSchema = yup.object().shape({
  name: yup.string().min(3, "Name must be at least 3 characters").optional(),
  email: yup.string().optional().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .optional()
    .required("Phone number is required")
    .test("is-valid-phone", "Invalid phone number", (value) => {
      return value ? isValidPhoneNumber(value) : false;
    }),
});

const EditProfileDetails: React.FC = () => {
  const user = getUserSession();
  const updateProfile = useUpdateProfile(user?.id ?? "");

  const form = useForm({
    resolver: yupResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone_number || "",
    },
  });

  const { isDirty } = form.formState;

  const onSubmit = async (data: yup.InferType<typeof editProfileSchema>) => {
    updateProfile
      .mutateAsync({
        name: data.name,
        phone_number: data.phone || user?.phone_number || "",
      })
      .then(() => {
        updateUserSession({
          name: data.name,
          phone_number: data.phone || user?.phone_number || "",
        });
      })
      .catch(console.error);
  };

  return (
    <div className=" flex flex-col space-y-6 animate-in fade-in-0 duration-700 ease-in-out">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input disabled placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl className="flex h-12 w-full rounded-full border-brand-border placeholder:text-brand-placeholder border bg-transparent px-3 py-4 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:focus:border-black disabled:focus:bg-white disabled:opacity-50 md:text-sm">
                  <PhoneInputWithCountrySelect
                    international
                    defaultCountry="NG"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    className={`
            [&>input]:bg-background
            [&>input]:rounded-full
            [&>input]:border-0
            [&>input]:outline-0
            [&>input]:h-11
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
          <div className="space-y-2">
            <Button type="submit" isLoading={updateProfile.isPending} disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileDetails;
