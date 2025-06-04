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
import useDisclosure from "@/hooks/use-disclosure";
import { ButtonToggler } from "@/pages/Auth/CompleteInvite";
import { changePasswordSchema } from "@/utils/validation-schema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { InferType } from "yup";

const ProfileSecurityTemplate: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isPasswordOpen, onToggle: onToggleShow } = useDisclosure();
  const { isOpen: isOldPasswordOpen, onToggle: onToggleOldPassword } = useDisclosure();

  const form = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = (data: InferType<typeof changePasswordSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col animate-in py-3 fade-in-0 duration-700 ease-in-out">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileSecurityTemplate;
