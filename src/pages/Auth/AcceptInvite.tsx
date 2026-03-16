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
import useAcceptInvite from "@/hooks/contacts/use-accept-invite";
import useDisclosure from "@/hooks/use-disclosure";
import { PAGES } from "@/lib/constants";
import { setCookie } from "cookies-next";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Logo } from "../../assets";
import VerificationCard from "./VerificationCard";

interface AcceptInviteFormData {
  name: string;
  password: string;
  confirmPassword: string;
}

const AcceptInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isPasswordOpen, onToggle: onToggleShow } = useDisclosure();
  const token = searchParams.get("token");
  const acceptInvite = useAcceptInvite();
  const navigate = useNavigate();

  const form = useForm<AcceptInviteFormData>({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error("Invalid invitation link");
      navigate(PAGES.LOGIN_PAGE);
    }
  }, [token, navigate]);

  const onSubmit = async (data: AcceptInviteFormData) => {
    // Validate password match
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    // Validate password length
    if (data.password.length < 8) {
      form.setError("password", {
        type: "manual",
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    try {
      const response = await acceptInvite.mutateAsync({
        token: token ?? "",
        name: data.name,
        password: data.password,
      });

      // Store the JWT token and user session
      if (response?.data?.token) {
        setCookie("user_session_token", response.data.token);
        setCookie("user_session", JSON.stringify(response.data.user));
        toast.success("Account activated successfully!");
        
        // Redirect to projects page for client users
        setTimeout(() => {
          navigate("/home/projects");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to accept invitation");
    }
  };

  if (acceptInvite.isSuccess && acceptInvite.data) {
    return (
      <VerificationCard
        title="Invitation accepted successfully"
        description="Your account has been activated successfully. Redirecting to your projects..."
        buttonText="Go to Projects"
        onButtonClick={() => navigate("/home/projects")}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in-0 duration-700 ease-in-out">
      <div>
        <div className="my-3 flex">
          <img src={Logo} alt="Logo" className="w-12" />
        </div>
        <h1 className="text-3xl font-medium">Accept Invitation</h1>
        <p className="text-gray-600">Set up your account to get started</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Password</FormLabel>
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Confirm Password</FormLabel>
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
              isLoading={acceptInvite.isPending}
              disabled={!token}
            >
              Accept Invitation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AcceptInvite;

export const ButtonToggler = ({
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
    type="button"
  >
    {isShown ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </Button>
);
