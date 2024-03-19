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
import { useEffect } from "react";

export function DeleteDialog({
    title,
    description,
    dialogButtonText,
    onDelete,
    isLoading,
    onClose,
    open,
}: any) {
    const handleDelete = () => {
        onDelete();
        onClose();
    }

    useEffect(() => {
        console.log(open);
    }, [open])

    return (
        <Dialog open={open}>
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
                        <Button className="w-full mb-2" disabled={isLoading} onClick={onClose}>
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