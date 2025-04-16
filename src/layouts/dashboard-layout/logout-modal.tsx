"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  ModalProps,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PAGES } from "@/lib/constants";
import { logout } from "@/services/api.service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function LogoutModal({ isOpen, onClose }: ModalProps) {
  const authLogout = useMutation({
    mutationFn: logout,
  });

  const navigate = useNavigate();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent onEscapeKeyDown={onClose} className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Log Out</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will sign you out of your account and
            remove your data from your cache.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center gap-2">
          <AlertDialogAction className="w-full" onClick={onClose}>
            Cancel
          </AlertDialogAction>
          <Button
            variant="outline"
            className="w-full"
            isLoading={authLogout.isPending}
            onClick={() => {
              authLogout.mutateAsync().then(() => {
                navigate(PAGES.LOGIN_PAGE);
              });
            }}
          >
            Log out
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutModal;
