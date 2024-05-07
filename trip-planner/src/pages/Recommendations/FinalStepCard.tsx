import { CirclePlus, Clock, Star } from "lucide-react";
import "./styles/final-step-card.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FinalStepMoreInformationDialog from "./FinalStepMoreInformationDialog";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/services/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { addTripDetails } from "@/services/TripDetailService";

const FinalStepCard = ({ recommendations }: any) => {
  const [viewInformationOpen, setViewInformationOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } =
    useUser();
  const [disabledButtons, setDisabledButtons] = useState<any>([]);
  const navigate = useNavigate();

  const onViewMoreInformation = (card: any) => {
    setSelectedCard(card);
    setViewInformationOpen(true);
  };

  const onAddPlan = async (card: any, index: any) => {
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

    const dto = {
      name: card.place.displayName,
      eventType: 5,
      address: card.place.formattedAddress,
      website: card.place.website,
      phoneNumber: card.place.internationalPhoneNumber,
      latitude: card.place.location.latitude,
      longitude: card.place.location.longitude,
    };

    try {
      setDisabledButtons([...disabledButtons, index]);
      const response = await addTripDetails(dto);
      if (!response.ok) {
        setDisabledButtons(disabledButtons.filter((item: any) => item !== index));
        toast.error("Failed to add plan. Try again!", {
          position: "top-center",
        });
        return;
      }

      toast.success("Plan added successfully!", {
        position: "top-center",
      });
    } catch {
      setDisabledButtons(disabledButtons.filter((item: any) => item !== index));
    }
  };

  return (
    <div className="items-center justify-center my-2 border bg-secondary text-primary rounded-md">
      <div className="p-8">
        {recommendations.map((recommendation: any) => (
          <div key={recommendation.category}>
            <h2 className="text-xl font-bold mt-4 ml-2">
              {recommendation.category.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <div className="flex-1 flex flex-wrap">
              {recommendation.recommendations &&
              recommendation.recommendations.length > 0 ? (
                recommendation.recommendations.map((rec: any, index: any) => (
                  <div
                    key={rec.place.googleMapsUri}
                    className="flex-1 flex flex-col m-2 border bg-gray-100 rounded-md max-w-[500px]"
                  >
                    <img
                      src={rec.photoUri || "/avatar-placeholder.png"}
                      alt="place"
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col flex-1">
                      <a
                        href={rec.place.googleMapsUri}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <h2 className="final-card-title">
                          {rec.place.displayName}
                        </h2>
                      </a>
                      <div className="w-full flex flex-wrap gap-1 mt-1 mb-2">
                        {rec.place.types.slice(0, 4).map(
                          (type: any, index: any) =>
                            index <= 3 && (
                              <Badge key={type}>
                                <p className="flex justify-end items-end">
                                  {type
                                    .split("_")
                                    .map(
                                      (word: any) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                </p>
                              </Badge>
                            )
                        )}
                      </div>
                      <p className="address-text">
                        {rec.place.formattedAddress}
                      </p>
                      <span className="text-md flex items-center">
                        <Star fill="#E49B0F" strokeWidth={0} />
                        <p className="rating-text">
                          {rec.place.rating} ({rec.place.userRatingCount}{" "}
                          reviews)
                        </p>
                      </span>
                      <div className="flex-1 mt-4 flex items-end gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewMoreInformation(rec)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          More Information
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddPlan(rec, rec.place.displayName + index)}
                          disabled={disabledButtons.includes(rec.place.displayName + index)}
                        >
                          <CirclePlus className="mr-2 h-4 w-4" />
                          Add Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="ml-2 text-md ">
                  No places were found. Try increasing the range or choosing
                  another address
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <FinalStepMoreInformationDialog
        open={viewInformationOpen}
        setOpen={setViewInformationOpen}
        weekdayDescriptions={selectedCard?.place?.weekdayDescriptions}
        phoneNumber={selectedCard?.place?.internationalPhoneNumber}
        website={selectedCard?.place?.website}
        priceLevel={selectedCard?.place?.priceLevel}
      />
    </div>
  );
};

export default FinalStepCard;
