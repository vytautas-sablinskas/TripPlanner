import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Document name is required.",
  })
  .max(30, {
    message: "Document name must be less than or equal to 30 characters.",
  }),
  file: z.any(),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const AddDocumentDialog = ({ onAdd, isLoading, open, setOpen }: any) => {
  const [uploadedImage, setUploadedImage] = useState<any>(
    "/document-placeholder.png"
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      file: null,
    },
  });

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large! 2MB Max.", { position: "bottom-right" });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file type!", { position: "bottom-right" });
      return;
    }

    form.setValue("name", file.name);
    form.setValue("file", file);
    if (file.type.includes("image")) {
      setUploadedImage(URL.createObjectURL(file));
    } else {
        setUploadedImage("/document-placeholder.png");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && setOpen(!open)}>
      <DialogContent
        className="sm:max-w-[525px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAdd)}>
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription className="mt-2 mb-4">
                Max size of the document is 5 MB. Allowed formats are JPG, PNG
                and PDF
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full justify-center mb-4">
                <img
                src={uploadedImage}
                height={300}
                className="image"
                width={300}
                />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Change To Upload New Image</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleFileUpload} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4 mt-4">
                  <FormLabel required>Plan Name</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Enter Document Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col mt-4">
              <DialogClose>
                <Button className="w-full mb-4" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="mb-4" disabled={isLoading}>
                Add New Document
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
