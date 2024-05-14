import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export function DeleteDialog({
  title,
  description,
  dialogButtonText,
  onDelete,
  isLoading,
  setOpen,
  open,
}: any) {
  const handleDelete = async () => {
    await onDelete();
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
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col">
          <DialogClose>
            <Button className="w-full mb-2" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="mb-2"
            onClick={handleDelete}
            variant="destructive"
            disabled={isLoading}
          >
            {dialogButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
