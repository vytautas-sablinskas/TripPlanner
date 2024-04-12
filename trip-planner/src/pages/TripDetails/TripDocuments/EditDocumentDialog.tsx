import { refreshAccessToken } from "@/api/AuthenticationService";
import { getTripDocumentMembers } from "@/api/TripDocumentService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiple-selector";
import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
});

const EditDocumentDialog = ({
  onEdit,
  isLoading,
  open,
  setOpen,
  document,
  members,
}: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: document.name,
    },
  });
  const navigate = useNavigate();
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const [isLoadingMembers, setIsLoading] = useState<any>(false);
  const [isPrivateDocument, setIsPrivateDocument] = useState<any>(false);

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 3];
  };

  const getTripDetailId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 3];
  };

  useEffect(() => {
    const tryFetchingMembers = async () => {
      if (!open) return;

      const accessToken = localStorage.getItem("accessToken");
      if (!checkTokenValidity(accessToken || "")) {
        const result = await refreshAccessToken();
        if (!result.success) {
          toast.error("Session has expired. Login again!", {
            position: "top-center",
          });

          changeUserInformationToLoggedOut();
          navigate(Paths.LOGIN);
          return;
        }

        changeUserInformationToLoggedIn(
          result.data.accessToken,
          result.data.refreshToken
        );
      }

      setIsLoading(true);
      const response = await getTripDocumentMembers(
        getTripId(),
        getTripDetailId(),
        document.id
      );
      if (!response.ok) {
        toast.error("Unexpected error. Try refreshing page", {
          position: "top-center",
        });
        return;
      }

      const data = await response.json();
      setSelectedMembers(
        members
          .filter((member: any) => data.memberIds.includes(member.id))
          .map((member: any) => ({ label: `${member.fullName} - ${member.email}`, value: member.id }))
      );
      setIsPrivateDocument(data.isPrivate)
      setIsLoading(false);
    };

    tryFetchingMembers();
  }, [open]);

  const onSubmit = (formValues : any) => {
    const dto = {
      ...formValues,
      memberIds: selectedMembers.map((member: any) => member.value),
      isPrivate: isPrivateDocument,
    };

    console.log(dto);

    onEdit(dto);
  }

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && setOpen(!open)}>
      <DialogContent
        className="sm:max-w-[525px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {isLoadingMembers ? (
          <DialogHeader>Loading...</DialogHeader>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Edit Document</DialogTitle>
              </DialogHeader>
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
                  defaultOptions={members.map((traveller: any) => ({
                    label: `${traveller.fullName} - ${traveller.email}`,
                    value: traveller.id,
                  }))}
                  placeholder="Select members to add"
                />
                {selectedMembers.length > 0 && (
                  <Card className="p-2 mt-2 max-h-[150px] overflow-y-scroll">
                    {members
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
                  <Button
                    className="w-full mb-4"
                    type="button"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="mb-4" disabled={isLoading}>
                  Update Document Information
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;
