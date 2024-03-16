import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "./styles/trip-detail-card.css";

const TripDetailCard = ({ detail } : any) => {
  const startTime = detail.startTime ? new Date(detail.startTime) : null;
  const endTime = detail.endTime ? new Date(detail.endTime) : null;

  function formatTime(time : any) {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedTime = time.toLocaleTimeString('en-US', options);
    return formattedTime;
  }

  function formatTimezoneOffset() {
      const timezoneOffset = new Date().getTimezoneOffset();
      const offsetSign = timezoneOffset < 0 ? '+' : '-';
      const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
      return `GMT ${offsetSign}${offsetHours}`;
  }

  return (
    <Card>
      <CardContent className="w-full min-h-[125px] min-w-[300px] p-[24px] pr-0 flex justify-between sm:p-2">
        <div>
          <p className="">{startTime && formatTime(startTime)}</p>
          <p className="">{formatTimezoneOffset()}</p>
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
          <p className="event-name">{detail.name}</p>
          <p className="text-xs">{detail.address}</p>
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
