import {
  ArrowLeft,
  CirclePlus,
  CircleX,
  Globe,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import "./styles/trip-detail-view.css";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/user-provider/UserContext";
import {
  deleteTripDetail,
  getTripDetailForView,
} from "@/api/TripDetailService";
import DeleteDialog from "@/components/Extra/DeleteDialog";
import TripDetailViewDocument from "./TripDetailViewDocument";
import AddDocumentDialog from "./TripDocuments/AddDocumentDialog";
import {
  addTripDocument,
  deleteTripDocument,
  editTripDocument,
} from "@/api/TripDocumentService";

const TripDetailView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState(false);
  const [isAddDocumentSubmitting, setIsAddDocumentSubmitting] = useState(false);
  const [isEditDocumentSubmitting, setIsEditDocumentSubmitting] =
    useState(false);
  const [isDeleteDocumentDeleting, setIsDeleteDocumentDeleting] =
    useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [tripDetail, setTripDetail] = useState<any>({});
  const [travellers, setTravellers] = useState<any>([]);

  const getTripId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 3];
  };

  const getTripDetailId = () => {
    const path = location.pathname.split("/");
    return path[path.length - 1];
  };

  useEffect(() => {
    const tryFetchingDetails = async () => {
      setIsLoading(true);
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

      const response = await getTripDetailForView(
        getTripDetailId(),
        getTripId()
      );
      if (!response.ok) {
        toast.error("Unexpected error. Try again later", {
          position: "top-center",
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setDocuments(data.documents);
      setTripDetail({
        name: data.name,
        address: data.address,
        phoneNumber: data.phoneNumber,
        website: data.website,
        notes: data.notes,
      });
      setTravellers(data.travellers);
      setIsLoading(false);
    };

    tryFetchingDetails();
  }, []);

  const handleDelete = async () => {
    setIsLoading(true);
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

    const response = await deleteTripDetail(getTripDetailId());
    if (!response || !response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
    }

    toast.success("Plan deleted successfully", { position: "top-center" });
    navigate(Paths.TRIP_DETAILS.replace(":id", getTripId()));
    setIsLoading(false);
  };

  const handleAddDocument = async (formValues: any) => {
    setIsAddDocumentSubmitting(true);
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

    const form = new FormData();
    form.append("document", formValues.file);
    form.append("name", formValues.name);
    form.append("memberIds", JSON.stringify(formValues.memberIds))
    form.append("isPrivate", formValues.isPrivate)

    const response = await addTripDocument(
      getTripId(),
      getTripDetailId(),
      form
    );
    if (!response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsAddDocumentSubmitting(false);
      return;
    }

    const data = await response.json();
    setDocuments([...documents, data]);
    setIsAddDocumentSubmitting(false);
    setIsAddDocumentDialogOpen(false);
    toast.success("Document added successfully", { position: "top-center" });
  };

  const handleDeleteDocument = async (id: any) => {
    setIsDeleteDocumentDeleting(true);
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

    const response = await deleteTripDocument(
      getTripId(),
      getTripDetailId(),
      id
    );
    if (!response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsDeleteDocumentDeleting(false);
      return;
    }

    setDocuments(documents.filter((document: any) => document.id !== id));
    toast.success("Document deleted successfully", { position: "top-center" });
    setIsDeleteDocumentDeleting(false);
  };

  const handleEditDocument = async (formValues: any) => {
    setIsEditDocumentSubmitting(true);
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

    const members = formValues.isPrivate ? formValues.memberIds : [];
    const response = await editTripDocument(
      getTripId(),
      getTripDetailId(),
      formValues.id,
      { name: formValues.name, memberIds: members, isPrivate: formValues.isPrivate }
    );
    if (!response.ok) {
      toast.error("Unexpected error. Try again later", {
        position: "top-center",
      });
      setIsEditDocumentSubmitting(false);
      return;
    }

    setDocuments(
      documents.map((document: any) =>
        document.id === formValues.id
          ? { ...document, name: formValues.name }
          : document
      )
    );
    toast.success("Document edited successfully", { position: "top-center" });
    setIsEditDocumentSubmitting(false);
  };

  return (
    <div className="trip-view-main-container">
      <span
        className="back-to-trip-summary"
        onClick={() => navigate(Paths.TRIP_DETAILS.replace(":id", getTripId()))}
      >
        <ArrowLeft className="mr-2" />
        <p>Back To Trip Summary</p>
      </span>
      <span className="trip-first-row">
        <h1 className="trip-name-title">{tripDetail.name}</h1>
        <span className="change-info-buttons">
          <Button
            className="mr-3"
            variant="ghost"
            onClick={() =>
              navigate(
                Paths.TRIP_DETAILS_EDIT.replace(":tripId", getTripId()).replace(
                  ":planId",
                  getTripDetailId()
                )
              )
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
          <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(true)}>
            <CircleX className="mr-2 h-4 w-4" />
            Delete Plan
          </Button>
          <DeleteDialog
            open={isDeleteDialogOpen}
            title="Delete Plan"
            description="Are you sure you want to delete this plan? This will permanently delete this plan and its contents. You and all trip participants will not be able to access the plan or any documents related to this plan anymore."
            dialogButtonText="Delete Plan"
            onDelete={handleDelete}
            isLoading={isLoading}
            onClose={() => setIsDeleteDialogOpen(false)}
            setOpen={setIsDeleteDialogOpen}
          />
        </span>
      </span>
      <Card className="trip-detail-view-information-container">
        <CardContent>
          <h2 className="information-container-title">Plan Information</h2>
          <div className="trip-detail-view-time-container">
            <div className="flex flex-col">
              <p className="font-medium text-lg">Starts Sat, Mar 9, 2024</p>
              <p className="font-bold text-xl">11:59 AM GMT+2</p>
            </div>
            <div className="ml-32">
              <p className="font-medium text-lg">Ends Mon, Mar 11, 2024</p>
              <p className="font-bold text-xl">7:59 PM GMT+2</p>
            </div>
          </div>
          <div className="activity-addresses">
            {tripDetail.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  tripDetail.address
                )}`}
                target="_blank"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {tripDetail.address}
              </a>
            )}
            {tripDetail.phoneNumber && (
              <a href={`tel:${tripDetail.phoneNumber}`}>
                <Phone className="w-4 h-4 mr-2" />
                {tripDetail.phoneNumber}
              </a>
            )}
            {tripDetail.website && (
              <a
                href={tripDetail.website}
                target="_blank"
              >
                <Globe className="w-4 h-4 mr-2" />
                {tripDetail.website}
              </a>
            )}
          </div>
          <div className="notes">
            <p className="mb-5">
              {tripDetail.notes}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="trip-detail-view-documents">
        <span className="documents-information-container">
          <h2 className="font-bold text-xl">Documents</h2>
          <Button
            className="p-2 justify-start"
            variant="ghost"
            onClick={() => setIsAddDocumentDialogOpen(true)}
          >
            <CirclePlus className="h-6 w-6 mr-3" />
            Add PDF or Photo
          </Button>
        </span>
        <div className="documents-document-container">
          {documents.map((document: any) => (
            <TripDetailViewDocument
              key={document.id}
              document={document}
              onDelete={handleDeleteDocument}
              isDeleteLoading={isDeleteDocumentDeleting}
              onEdit={handleEditDocument}
              isEditLoading={isEditDocumentSubmitting}
              members={travellers}
            />
          ))}
        </div>
        <AddDocumentDialog
          onAdd={handleAddDocument}
          isLoading={isAddDocumentSubmitting}
          open={isAddDocumentDialogOpen}
          setOpen={setIsAddDocumentDialogOpen}
          travellers={travellers}
        />
      </Card>
    </div>
  );
};

export default TripDetailView;
