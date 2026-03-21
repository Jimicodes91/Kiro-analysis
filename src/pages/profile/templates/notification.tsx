import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const editProfileSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const NotificationSection: React.FC = () => {
  const form = useForm({
    resolver: yupResolver(editProfileSchema),
  });

  const onSubmit = async (data: yup.InferType<typeof editProfileSchema>) => {
    console.log(data);
  };

  return (
    <div className=" flex flex-col space-y-10 animate-in fade-in-0 duration-700 py-4 ease-in-out">
      <div className="space-y-4">
        <Heading size="h5">How do you want to receive notification and updates?</Heading>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-4 w-full items-stretch sm:items-end"
          >
            <div className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Button type="submit" fullWidth={true}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Heading size="h5">Notification Preferences</Heading>
          <p className="text-sm text-[#00000066] max-w-[250px]">
            A list of all tasks linked to the project, including their status
          </p>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <div>
              <Label htmlFor="airplane-mode" className="text-md">
                Email notification
              </Label>
              <p className="text-sm text-[#00000066]">
                Receive news and update directly to your mail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
