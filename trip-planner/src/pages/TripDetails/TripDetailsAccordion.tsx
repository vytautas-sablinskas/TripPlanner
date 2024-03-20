import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TripDetailCard from "./TripDetailCard";
import "./styles/trip-details-accordion.css";
import { formatDateToString } from "@/utils/date";

const TripDetailsAccordion = ({ tripDetails, onDelete }: any) => {
  const days = Object.keys(tripDetails).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const sortedDays: { [key: string]: any[] } = days.reduce((acc, day) => {
    const sortedDetails = tripDetails[day].sort((a : any, b : any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return { ...acc, [day]: sortedDetails };
  }, {});
  return (
    <Accordion type="multiple" className="w-full">
      {days.map((day, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{formatDateToString(day)}</AccordionTrigger>
          <AccordionContent className="day-container">
            {sortedDays[day].map((detail : any, detailIndex : any) => (
              <TripDetailCard key={detailIndex} detail={detail} onDelete={onDelete}/>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TripDetailsAccordion;
