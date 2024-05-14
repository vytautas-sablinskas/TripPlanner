import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { CircleX } from "lucide-react";

export function DeleteDialogButton({
  buttonText,
  title,
  description,
  dialogButtonText,
  onDelete,
  isLoading,
  open,
  setOpen,
}: any) {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full p-0">
          <CircleX className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
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
            onClick={onDelete}
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
