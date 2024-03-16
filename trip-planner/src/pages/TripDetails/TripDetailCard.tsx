import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./styles/trip-detail-card.css";

const TripDetailCard = () => {
  return (
    <Card>
      <CardContent className="w-full min-h-[125px] min-w-[300px] p-[24px] pr-0 flex justify-between sm:p-2">
        <div>
          <p className="">11:59 AM</p>
          <p className="">GMT+2</p>
        </div>
        <span className="event-image-container">
          <Separator orientation="vertical" className="mx-5" />
          <img
            src="https://via.placeholder.com/40"
            alt="activity"
            className="activity-image"
            height={40}
            width={40}
          />
          <Separator orientation="vertical" className="mx-5" />
        </span>
        <div className="event-container-information">
          <p className="event-name">Event name</p>
          <p className="text-xs">
            Kings College London, Stamford St, London SE1 9NQ, UK
          </p>
        </div>
        <div className="separator-div">
            <Separator orientation="vertical" className="mx-5" />
        </div>
        
        <div className="content-buttons">
            <Button>View Plan</Button>
            <Button>Edit Plan</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripDetailCard;
