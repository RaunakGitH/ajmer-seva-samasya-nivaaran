
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type UserFormData = {
  fullName: string;
  email: string;
  role: string;
  phone: string;
  password?: string;
};

type UserFormProps = {
  isOpen: boolean;
  isEditing: boolean;
  formData: UserFormData;
  formErrors: {[key: string]: string};
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  dialogCloseRef: React.RefObject<HTMLButtonElement>;
};

const UserForm = ({
  isOpen,
  isEditing,
  formData,
  formErrors,
  isSubmitting,
  onClose,
  onSubmit,
  onInputChange,
  dialogCloseRef,
}: UserFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update user information in the system." : "Create a new user account in the system."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="fullName" className="text-right text-sm font-medium">
              Full Name
            </label>
            <div className="col-span-3 space-y-1">
              <Input
                id="fullName"
                placeholder="Enter full name"
                className={formErrors.fullName ? "border-red-500" : ""}
                value={formData.fullName}
                onChange={onInputChange}
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-500">{formErrors.fullName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm font-medium">
              Email
            </label>
            <div className="col-span-3 space-y-1">
              <Input
                id="email"
                placeholder="email@example.com"
                type="email"
                className={formErrors.email ? "border-red-500" : ""}
                disabled={isEditing}
                value={formData.email}
                onChange={onInputChange}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500">{formErrors.email}</p>
              )}
              {isEditing && (
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              )}
            </div>
          </div>
          {!isEditing && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right text-sm font-medium">
                Password
              </label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="password"
                  placeholder="Enter password"
                  type="password"
                  className={formErrors.password ? "border-red-500" : ""}
                  value={formData.password || ""}
                  onChange={onInputChange}
                />
                {formErrors.password && (
                  <p className="text-xs text-red-500">{formErrors.password}</p>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="role" className="text-right text-sm font-medium">
              Role
            </label>
            <select 
              id="role" 
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.role}
              onChange={onInputChange}
            >
              <option value="citizen">Citizen</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              className="col-span-3"
              value={formData.phone}
              onChange={onInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            ref={dialogCloseRef}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
