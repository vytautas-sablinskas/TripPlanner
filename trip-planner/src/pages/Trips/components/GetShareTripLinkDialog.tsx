import { refreshAccessToken } from "@/services/AuthenticationService";
import { updateShareTripLink } from "@/services/TripService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { CirclePlus, CircleX, Copy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CopyToClipboard } from "react-copy-to-clipboard";

const GetShareTripLinkDialog = ({ open, setOpen, link, setLink }: any) => {
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState<any>({
    value: link ? link : "",
    copied: false,
  });

  const getTripId = () => {
    const pathParts = location.pathname.split("/");
    return pathParts[pathParts.length - 2];
  };

  const updateLink = async () => {
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
        result.data.refreshToken,
        result.data.id
      );
    }

    try {
      setIsSubmitting(true);
      const response = await updateShareTripLink(getTripId());
      if (!response.ok) {
        toast.error("Failed to update link. Try again later.", {
          position: "top-center",
        });
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      setLink(data?.link === null ? "" : data.link);
      setIsSubmitting(false);
    } catch {
      toast.error("Failed to update link. Try again later.", {
        position: "top-center",
      });
      setIsSubmitting(false);
    }
  };

  const onCopy = () => {
    setState({ ...state, copied: true });
    toast.success("Link copied to clipboard", {
      position: "top-center",
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent>
        <Label>Link For Sharing Trip</Label>
        <Input
          className="p-2"
          placeholder="To get link press create link button"
          value={link}
          onChange={() => {}}
        />
        <div className="w-full flex justify-end">
          <Button onClick={updateLink} className="mr-2">
            {!link || link.length <= 0 ? (
              <div className="flex items-center">
                <CirclePlus className="mr-2 h-4 w-4" />
                <p>Create Link</p>
              </div>
            ) : (
              <div className="flex items-center">
                <CircleX className="mr-2 h-4 w-4" />
                <p>Remove Link</p>
              </div>
            )}
          </Button>
          <CopyToClipboard text={link} onCopy={() => onCopy()}>
            <Button disabled={!link || link.length === 0}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </CopyToClipboard>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetShareTripLinkDialog;
