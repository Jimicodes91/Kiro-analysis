"use client";
import {
  AlertDialog,
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
import { useNavigate } from "react-router-dom";

function LogoutModal({ isOpen, onClose }: ModalProps) {
  const navigate = useNavigate();
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent onEscapeKeyDown={onClose} className="bg-white p-3 !max-w-lg">
        <div className="p-3">
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign you out of your account and remove your data from your
              browser cache.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center pt-6 gap-2">
            <Button size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout().then(() => {
                  navigate(PAGES.LOGIN_PAGE);
                });
              }}
            >
              Log out
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LogoutModal;
