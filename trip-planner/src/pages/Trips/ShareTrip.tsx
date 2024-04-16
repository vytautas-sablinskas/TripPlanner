import { refreshAccessToken } from "@/api/AuthenticationService";
import { getTripShareInformation, updateTripShareInformation } from "@/api/TripService";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleX, Share } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import GetShareTripLinkDialog from "./components/GetShareTripLinkDialog";

const ShareTrip = () => {
  const getTripId = () => {
    const pathParts = location.pathname.split("/");
    return pathParts[pathParts.length - 2];
  };

  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [descriptionInHtml, setDescriptionInHtml] = useState("");
  const [isLoading, setIsLoading] = useState<any>(true);
  const [isSubmitting, setIsSubmitting] = useState<any>(false);
  const [selectedPhotos, setSelectedPhotos] = useState<any>([]);
  const fileInputRef = useRef<any>(null);
  const [isGetLinkOpen, setIsGetLinkOpen] = useState<any>(false);
  const [link, setLink] = useState<any>("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "color",
    "background",
    "align",
    "size",
    "font",
  ];

  useEffect(() => {
    const fetchSharedInformation = async () => {
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

      setIsLoading(true);
      const response = await getTripShareInformation(getTripId());
      if (!response.ok) {
        toast.error("Failed to get shared information", {
          position: "top-center",
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setTitle(data.title);
      setDescriptionInHtml(data.descriptionInHtml);
      setSelectedPhotos(data.photos);
      setIsLoading(false);
      setLink(data.link);
    };

    fetchSharedInformation();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const updateInformation = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("descriptionInHtml", descriptionInHtml);
    Array.from(selectedPhotos).forEach((photo: any) => {
      if (typeof photo === "string") formData.append("existingPhotos", photo);
      else formData.append("photos", photo);
    });

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

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      setIsSubmitting(true);
      try {
        const response = await updateTripShareInformation(getTripId(), formData);
        if (!response.ok) {
          toast.error("Failed to update information", {
            position: "top-center",
          });
          return;
        }
    
        toast.success("Information updated successfully", {
          position: "top-center",
        });
        setIsSubmitting(false);
      } catch {
        setIsSubmitting(false);
        toast.error("Failed to update information", {
          position: "top-center",
        });
      }
  };

  const removePhoto = (index: any) => {
    setSelectedPhotos((prevPhotos: any) =>
      Array.from(prevPhotos).filter((photo, i) => i !== index)
    );
  };

  const handlePhotoChange = (event: any) => {
    const files = event.target.files;
    if (!files) return;

    const maxSize = 2 * 1024 * 1024;
    const oversizedFiles = Array.from(files).filter((file : any) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Some files exceed the maximum size of 2 MB", {
        position: "top-center",
      });
      return;
    }

    if (files.length + selectedPhotos.length > 5) {
      toast.error("You can only upload up to 5 photos", {
        position: "top-center",
      });
      return;
    }

    setSelectedPhotos((prev: any) => [...prev, ...files]);
  };

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <Card className="p-4 sm:max-w-full w-full">
        <CardContent>
          <Label>Title</Label>
          <Input type="text" className="mb-10" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
          <Label>Description</Label> 
          <ReactQuill
            theme="snow"
            value={descriptionInHtml}
            onChange={setDescriptionInHtml}
            modules={modules}
            formats={formats}
            placeholder="Write something..."
          />
          <div className="mt-10">
            <Button variant="outline" className="mb-2" onClick={openFileInput}>
              Add Photo
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <CirclePlus className="ml-2 h-4 w-4" />
            </Button>
            <Label className="ml-2">Up to 5 photos</Label>
            <div className="flex flex-wrap gap-10 min-h-[240px] p-2 border">
              {selectedPhotos &&
                Array.from(selectedPhotos).map((photo: any, index: any) => (
                  <Card
                    key={index}
                    className="!p-0 sm:w-[300px] h-[200px] w-full relative"
                  >
                    <CardContent className="!p-0">
                      <div
                        className="h-[198px] w-full"
                      >
                        {typeof photo === "string" ? (
                          <img
                            src={photo}
                            alt={`selected-${index}`}
                            className="w-full h-full rounded"
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`selected-${index}`}
                            className="h-full w-full rounded"
                          />
                        )}
                                              <Button
                        className="absolute bottom-2 flex left-2 right-2"
                        onClick={() => removePhoto(index)}
                        variant="outline"
                      >
                        <CircleX className="h-4 w-4 mr-2" />
                        Remove Photo
                      </Button>
                      </div>

                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="mt-10 flex items-end flex-wrap">
              <Button className="mr-6" onClick={updateInformation} disabled={isSubmitting}>
                <UpdateIcon className="mr-2 w-4 h-4"/>
                Update Information
              </Button>
              <Button variant="outline" className="mt-2" onClick={() => setIsGetLinkOpen(true)}>
                <Share className="h-4 w-4 mr-2" />
                Get Share Link
              </Button>
            </div>
          </div>
          <GetShareTripLinkDialog 
            open={isGetLinkOpen}
            setOpen={setIsGetLinkOpen}
            link={link}
            setLink={setLink}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShareTrip;
