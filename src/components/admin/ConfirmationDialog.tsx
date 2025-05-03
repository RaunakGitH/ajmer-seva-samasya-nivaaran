
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserType } from "./UserTable";

type ConfirmationDialogProps = {
  isOpen: boolean;
  actionUser: UserType | null;
  actionType: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationDialog = ({
  isOpen,
  actionUser,
  actionType,
  onClose,
  onConfirm,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {actionType === "delete" ? "Delete User" : 
             actionType === "activate" ? "Activate User" : "Deactivate User"}
          </DialogTitle>
          <DialogDescription>
            {actionType === "delete" 
              ? "This action cannot be undone. This will permanently delete the user account from the system."
              : actionType === "activate"
              ? "This will restore user access to the system."
              : "This will prevent the user from accessing the system."}
          </DialogDescription>
        </DialogHeader>
        {actionUser && (
          <div className="py-4">
            <p className="text-center mb-4">
              Are you sure you want to {actionType} <span className="font-semibold">{actionUser.name}</span>?
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant={actionType === "delete" ? "destructive" : "default"}
            onClick={onConfirm}
          >
            {actionType === "delete" ? "Delete" : 
             actionType === "activate" ? "Activate" : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
