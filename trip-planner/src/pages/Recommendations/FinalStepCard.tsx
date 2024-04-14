import { CirclePlus, Clock, Star } from "lucide-react";
import "./styles/final-step-card.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FinalStepMoreInformationDialog from "./FinalStepMoreInformationDialog";

const FinalStepCard = ({ recommendations }: any) => {
  const [viewInformationOpen, setViewInformationOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const onViewMoreInformation = (card: any) => {
    setSelectedCard(card);
    setViewInformationOpen(true);
  };

  console.log(selectedCard);
  return (
    <div className="items-center justify-center my-2 border bg-secondary text-primary rounded-md">
      <div className="p-8">
        <h1 className="text-2xl font-bold ml-2">Recommendations</h1>
        {recommendations.map((recommendation: any) => (
          <div key={recommendation.category}>
            <h2 className="text-xl font-bold mt-4 ml-2">
              {recommendation.category.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <div className="flex-1 flex flex-wrap">
              {recommendation.recommendations &&
              recommendation.recommendations.length > 0 ? (
                recommendation.recommendations.map((rec: any) => (
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
                        <Button variant="outline" size="sm">
                          <CirclePlus className="mr-2 h-4 w-4" />
                          Add Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="ml-2 text-md ">
                  No places were found. Try increasing the range or writing a
                  more specific address
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
      />
    </div>
  );
};

export default FinalStepCard;
