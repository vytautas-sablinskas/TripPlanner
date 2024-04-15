import { getShareTripInformation } from "@/api/TripService";
import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import {
  formatDateToString,
  getFormattedDateRange,
  getLocalDate,
} from "@/utils/date";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TripDetailCard from "../TripDetails/TripDetailCard";
import { Card, CardContent } from "@/components/ui/card";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./styles/share-trip-view.css";

const ShareTripView = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [days, setDays] = useState<any>([]);
  const [sortedDays, setSortedDays] = useState<any>([]);
  const [tripInformation, setTripInformation] = useState<any>({});
  const [userName, setUserName] = useState<any>("");
  const [sharedInformation, setSharedInformation] = useState<any>({});
  const [isLoading, setIsLoading] = useState<any>(true);
  const fetchInformation = async () => {
    try {
      setIsLoading(true);
      const response = await getShareTripInformation(linkId);
      if (!response.ok) {
        navigate(Paths.HOME);
      }

      const data = await response.json();
      console.log(data);

      const tripDetailsByDay = data.tripDetails.reduce(
        (acc: any, detail: any) => {
          const startDate = getLocalDate(detail.startTime + "Z")
            .toISOString()
            .split("T")[0];
          if (!acc[startDate]) {
            acc[startDate] = [];
          }
          acc[startDate].push(detail);
          return acc;
        },
        {}
      );

      const days = Object.keys(tripDetailsByDay).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      const sortedDays: { [key: string]: any[] } = days.reduce((acc, day) => {
        const sortedDetails = tripDetailsByDay[day].sort(
          (a: any, b: any) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        return { ...acc, [day]: sortedDetails };
      }, {});
      setDays(days);
      setSortedDays(sortedDays);
      setTripInformation(data.tripInformation);
      setUserName(data.userDisplayName);
      setSharedInformation(data.sharedInformation);
      setIsLoading(false);
    } catch {
      navigate(Paths.HOME);
    }
  };

  useEffect(() => {
    if (!linkId) {
      navigate(Paths.HOME);
    }

    fetchInformation();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="export-information-main-container">
        <div className="mb-16">
          {(sharedInformation.title?.length > 0 ||
            (sharedInformation.descriptionInHtml?.length > 0 && sharedInformation.descriptionInHtml !== "<p><br></p>") ||
            (sharedInformation.photos &&
              sharedInformation.photos.length > 0)) && (
            <p className="text-3xl font-bold mb-4">
              Trip Review From {userName}
            </p>
          )}
          {(sharedInformation.title?.length > 0 || (sharedInformation.descriptionInHtml?.length > 0 && sharedInformation.descriptionInHtml !== "<p><br></p>")) && (
            <Card className="mt-6">
              <CardContent className="py-8 px-4">
                {sharedInformation.title && (
                  <p className="text-2xl font-bold px-[15px]">
                    {sharedInformation.title}
                  </p>
                )}
                {(sharedInformation.descriptionInHtml && sharedInformation.descriptionInHtml !== "<p><br></p>") && (
                  <ReactQuill
                    value={sharedInformation.descriptionInHtml}
                    theme="bubble"
                    readOnly
                  />
                )}
              </CardContent>
            </Card>
          )}

          {sharedInformation.photos && sharedInformation.photos.length > 0 && (
            <div className="h-[450px] my-8 w-full">
              <ImageGallery
                items={sharedInformation.photos.map((photo: any) => ({
                  original: photo,
                  thumbnail: photo,
                }))}
                showIndex={true}
                showFullscreenButton={false}
              />
            </div>
          )}
        </div>
        <p
          className={`text-3xl font-bold mb-4 ${
            sharedInformation.photos && sharedInformation.photos.length > 0
              ? "mt-[200px]"
              : "mt-4"
          }`}
        >
          Trip Information
        </p>
        <div className="trip-information-container !w-full">
          <div className="trip-information-content !p-0 !w-8/10">
            <h1 className="trip-information-title">{tripInformation.title}</h1>
            <p>{tripInformation.destinationCountry}</p>
            <p className="trip-information-time">
              {getFormattedDateRange(
                tripInformation.startDate,
                tripInformation.endDate
              )}
            </p>
          </div>
          <img
            src={tripInformation.photoUri}
            height={232}
            width={232}
            alt="trip"
            className="image trip-information-image !m-0"
          />
        </div>

        {days.map((day: any) => (
          <div key={day}>
            <p className="mt-8 text-2xl font-bold">{formatDateToString(day)}</p>
            <div className="card-container">
              {sortedDays[day].map((detail: any, detailIndex: any) => (
                <TripDetailCard
                  key={detailIndex}
                  detail={detail}
                  isButtonsOff
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareTripView;
