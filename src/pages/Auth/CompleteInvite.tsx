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
import useCompleteRegistration from "@/hooks/auth/use-complete-registration";
import useDisclosure from "@/hooks/use-disclosure";
import { PAGES } from "@/lib/constants";
import { completeInviteSchema } from "@/utils/validation-schema/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InferType } from "yup";
import { Logo } from "../../assets";
import VerificationCard from "./VerificationCard";

const CompleteInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isPasswordOpen, onToggle: onToggleShow } = useDisclosure();
  const role = searchParams.get("role");
  const companyId = searchParams.get("companyId");
  const email = searchParams.get("email");
  const completeRegistration = useCompleteRegistration();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(completeInviteSchema),
  });

  const onSubmit = async (data: InferType<typeof completeInviteSchema>) => {
    completeRegistration
      .mutateAsync({
        companyId: companyId ?? "",
        email: email ?? "",
        role: role ?? "",
        password: data.newPassword,
      })
      .catch(console.error);
  };

  if (completeRegistration.isSuccess && completeRegistration.data) {
    return (
      <VerificationCard
        title="Reset link sent"
        description="Your account has been registered sucessfully, please login"
        buttonText="Back to login"
        onButtonClick={() => navigate(PAGES.LOGIN_PAGE)}
      />
    );
  }

  return (
    <div className=" flex flex-col space-y-6 animate-in fade-in-0 duration-700 ease-in-out">
      <div>
        <div className="my-3 flex">
          <img src={Logo} alt="Logo" className="w-12" />
        </div>
        <h1 className="text-3xl font-medium">Set up account</h1>
        <p>Set up your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type name" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={isOpen ? "text" : "password"}
                      placeholder="••••••••"
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
                      placeholder="••••••••"
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
              fullWidth={true}
              isLoading={completeRegistration.isPending}
            >
              Accept Invite
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompleteInvite;

const ButtonToggler = ({
  isShown,
  onClick,
}: {
  isShown: boolean;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    size="icon"
    className="font-light text-gray-400 px-2 outline-none absolute top-1 right-0.5 border-0 hover:text-gray-500"
    onClick={onClick}
  >
    {isShown ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </Button>
);
