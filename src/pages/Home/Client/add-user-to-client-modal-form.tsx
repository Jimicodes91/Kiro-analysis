import Modal from "@/components/Modal";
import { ModalProps } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react"; // Import X icon for remove button
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Simple validation schema for adding user to client
const addUserToClientSchema = yup.object({
  email: yup.string().email("Must be a valid email").required("Email is required"),
});

type UserFormData = {
  email: string;
};

// Define a user type
type User = {
  id: string;
  name: string;
  initials: string;
};

// Available users to select from
const availableUsers: User[] = [
  { id: "1", name: "User One", initials: "UO" },
  { id: "2", name: "John Doe", initials: "JD" },
  { id: "3", name: "Ian Oliver", initials: "IO" },
  { id: "4", name: "Sarah Parker", initials: "SP" },
  { id: "5", name: "Tim Burton", initials: "TB" },
];

function AddUserToClientModal({
  onClose,
  clientName,
}: ModalProps & { clientName?: string }) {
  const [loading, setLoading] = useState(false);
  // Initialize with some default assignees
  const [assignees, setAssignees] = useState<User[]>([
    { id: "1", name: "User One", initials: "UO" },
    { id: "2", name: "John Doe", initials: "JD" },
    { id: "3", name: "Ian Oliver", initials: "IO" },
  ]);
  // Track select value state separately to handle reset
  const [selectValue, setSelectValue] = useState<string>("");

  const { handleSubmit, reset } = useForm<UserFormData>({
    resolver: yupResolver(addUserToClientSchema),
  });

  const handleSelectUser = (userId: string) => {
    // Check if user is already assigned (shouldn't happen with filtered options)
    const isAlreadyAssigned = assignees.some((user) => user.id === userId);
    if (isAlreadyAssigned) return;

    // Find the selected user from available users
    const userToAdd = availableUsers.find((user) => user.id === userId);
    if (userToAdd) {
      setAssignees([...assignees, userToAdd]);
      // Reset select value to empty to show placeholder again
      setSelectValue("");
    }
  };

  const handleRemoveAssignee = (userId: string) => {
    setAssignees(assignees.filter((user) => user.id !== userId));
    // Make sure the select value is reset when removing a user
    setSelectValue("");
  };

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("User added to client with assignees:", { data, assignees });
      onClose();
      reset();
    } catch (error) {
      console.error(`Failed to add user:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out already assigned users from dropdown options
  const availableToAssign = availableUsers.filter(
    (user) => !assignees.some((assignee) => assignee.id === user.id)
  );

  return (
    <Modal title="Add User" closeModal={onClose} fullHeight={false}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <div className="mb-4">
          <label className="block text-sm text-[#00000099] font-medium mb-1">
            Client name
          </label>
          <Input
            type="text"
            value={clientName || "Stellar Solutions Inc."}
            disabled
            className="w-full disabled:opacity-100 bg-[#EFEFEF]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#00000099] font-medium mb-1">
            Assign to
          </label>
          <div className="flex flex-col gap-2">
            <Select value={selectValue} onValueChange={handleSelectUser}>
              <SelectTrigger
                className="w-full"
                aria-label="Select Assignee"
                isLoading={loading}
              >
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {availableToAssign.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
                {availableToAssign.length === 0 && (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    No more users available
                  </div>
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {assignees.map((user) => (
                <div key={user.id} className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-[#F1F1F1] border border-[#E0E0E0] font-semibold">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(user.id)}
                    className="absolute -top-1 -right-1 bg-[#C0C0C0] border border-white rounded-full p-0.5 flex items-center justify-center"
                    aria-label={`Remove ${user.name}`}
                  >
                    <X className="h-3 w-3 text-[#0A1B41]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button type="submit" isLoading={loading} className="mt-4">
          Add User
        </Button>
      </form>
    </Modal>
  );
}

export default AddUserToClientModal;
