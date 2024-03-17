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
  const days = Object.keys(tripDetails);

  return (
    <Accordion type="multiple" className="w-full">
      {days.map((day, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{formatDateToString(day)}</AccordionTrigger>
          <AccordionContent className="day-container">
            {tripDetails[day].map((detail : any, detailIndex : any) => (
              <TripDetailCard key={detailIndex} detail={detail} onDelete={onDelete}/>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TripDetailsAccordion;
