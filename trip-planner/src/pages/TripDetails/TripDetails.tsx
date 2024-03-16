import { Button } from "@/components/ui/button";
import "./styles/trip-details.css";
import { Separator } from "@/components/ui/separator";
import TripDetailsAccordion from "./TripDetailsAccordion";

const TripDetails = () => {
    return (
        <div className="main-container">
            <div className="trip-information-container">
                <div className="trip-information-content">
                    <h1 className="trip-information-title">Trip To Paris</h1>
                    <p>Paris, France</p>
                    <p className="trip-information-time">Mar 16 - Mar 19, 2024</p>
                </div>
                <img src="https://via.placeholder.com/232" height={232} width={232} alt="trip" className="image trip-information-image"/>
            </div>
            <div className="trip-details-main-container">
                <div className="trip-details-information">
                    <p className="trip-details-itinerary">Itinerary</p>
                    <Button>
                        Add New Plan
                    </Button>
                </div>
                <Separator className="my-4" />
            </div>
            <div className="events-container">
                <TripDetailsAccordion />
            </div>
        </div>

    )
}

export default TripDetails;