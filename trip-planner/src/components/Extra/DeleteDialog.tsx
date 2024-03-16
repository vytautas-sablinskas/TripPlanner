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

export function DeleteDialog({
  buttonText,
  title,
  description,
  dialogButtonText,
  onDelete,
  loading,
}: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button className="mt-2">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="mt-2" onClick={onDelete}>
            {dialogButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
