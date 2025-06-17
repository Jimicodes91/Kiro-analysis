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
import useUpdatePassword from "@/hooks/auth/use-update-password";
import useDisclosure from "@/hooks/use-disclosure";
import { ButtonToggler } from "@/pages/Auth/CompleteInvite";
import { getUserSession } from "@/services/api.service";
import { changePasswordSchema } from "@/utils/validation-schema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";

const ProfileSecurityTemplate: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isPasswordOpen, onToggle: onToggleShow } = useDisclosure();
  const { isOpen: isOldPasswordOpen, onToggle: onToggleOldPassword } = useDisclosure();
  const user = getUserSession();

  const updatePassword = useUpdatePassword();
  const form = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const { isValid } = form.formState;

  const onSubmit = (data: InferType<typeof changePasswordSchema>) => {
    updatePassword
      .mutateAsync({
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        userId: user?.id ?? "",
      })
      .then(() => {
        form.setValue("oldPassword", "");
        form.setValue("newPassword", "");
        form.setValue("confirmNewPassword", "");
      })
      .catch(console.error);
  };

  return (
    <div className="flex flex-col animate-in py-3 fade-in-0 duration-700 ease-in-out">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={isOldPasswordOpen ? "text" : "password"}
                      placeholder="Old Password"
                      {...field}
                    />
                    <ButtonToggler
                      isShown={isOldPasswordOpen}
                      onClick={onToggleOldPassword}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={isOpen ? "text" : "password"}
                      placeholder="New Password"
                      {...field}
                    />
                    <ButtonToggler isShown={isOpen} onClick={onToggle} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={isPasswordOpen ? "text" : "password"}
                      placeholder="Confirm Password"
                      {...field}
                    />
                    <ButtonToggler isShown={isPasswordOpen} onClick={onToggleShow} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Button
              type="submit"
              isLoading={updatePassword.isPending}
              disabled={!isValid}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSecurityTemplate;
