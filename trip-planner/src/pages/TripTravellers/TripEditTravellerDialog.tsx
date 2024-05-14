import { ValueSelector } from "@/components/Extra/ValueSelector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { PermissionTypes } from "./PermissionTypes";

export function TripEditTravellerDialog({
  title,
  onEdit,
  currentPermission,
  isLoading,
  setOpen,
  open,
}: any) {
  const [permission, setPermission] = useState(String(currentPermission));

  const onEditPermissions = async () => {
    await onEdit(permission);
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && setOpen(!open)}>
      <DialogContent
        className="sm:max-w-[525px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ValueSelector
          value={permission}
          setValue={setPermission}
          items={PermissionTypes}
          label="Permissions"
          placeholder="Select Permissions"
        />
        <DialogFooter className="flex flex-col">
          <DialogClose>
            <Button className="w-full mb-2" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="mb-2"
            onClick={onEditPermissions}
            disabled={isLoading}
          >
            Edit Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TripEditTravellerDialog;
