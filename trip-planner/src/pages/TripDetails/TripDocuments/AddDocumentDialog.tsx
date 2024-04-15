import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiple-selector";
import { useUser } from "@/providers/user-provider/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
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

const AddDocumentDialog = ({
  onAdd,
  isLoading,
  open,
  setOpen,
  travellers,
  activeDocumentCount
}: any) => {
  const [uploadedImage, setUploadedImage] = useState<any>(
    "/document-placeholder.png"
  );
  const [isPrivateDocument, setIsPrivateDocument] = useState<any>(false);
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const { id } = useUser();

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

  const onSubmit = (formValues : any) => {
    if (!formValues.file) {
      form.setError("file", {
        message: "File is required."
      });
      return;
    }

    if (activeDocumentCount === 10) {
      toast.error("You can only have 10 active documents at a time!", { position: "top-center" });
      return;
    }

    const dto = {
      ...formValues,
      memberIds: selectedMembers.map((member: any) => member.value),
      isPrivate: isPrivateDocument,
    };

    onAdd(dto);
  }

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && setOpen(!open)}>
      <DialogContent
        className="sm:max-w-[525px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                height={200}
                className="h-[200px] w-[200px]"
                width={200}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel required>Upload File</FormLabel>
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
                  <FormLabel required>Document Name</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Enter Document Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrivate"
                checked={isPrivateDocument}
                onCheckedChange={setIsPrivateDocument}
              />
              <label
                htmlFor="isPrivate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Private Document
              </label>
            </div>
            {isPrivateDocument && (
              <div className="mt-4">
                <Label htmlFor="members">Assign Members To Document</Label>
                <MultipleSelector
                  value={selectedMembers}
                  onChange={setSelectedMembers}
                  defaultOptions={travellers.filter((member : any) => member.id !== id).map((traveller: any) => ({
                    label: `${traveller.fullName} - ${traveller.email}`,
                    value: traveller.id,
                  }))}
                  placeholder="Select members to add"
                />
                {selectedMembers.length > 0 && (
                  <Card className="p-2 mt-2 max-h-[150px] overflow-y-scroll">
                    {travellers
                    .filter((traveller: any) => selectedMembers.some((member: any) => traveller.id === member.value))
                    .map((traveller: any) => (
                      <div
                        className="flex items-center space-x-4 mb-2 w-full"
                        key={traveller.id}
                      >
                        <img
                          alt="Avatar"
                          className="traveller-element-image"
                          height="40"
                          src={traveller.photo}
                          width="40"
                        />
                        <div className="space-y-1 w-full flex-grow">
                          <h3 className="font-semibold">{traveller.email}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {traveller.fullName}
                          </p>
                        </div>
                        <Button
                          className="ml-auto trip-element-remove-button"
                          size="sm"
                          type="button"
                          onClick={() => setSelectedMembers((prev: any) => prev.filter((member: any) => member.value !== traveller.id))}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            )}
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
