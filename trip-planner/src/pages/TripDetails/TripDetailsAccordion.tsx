import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TripDetailCard from "./TripDetailCard";
import "./styles/trip-details-accordion.css";

const TripDetailsAccordion = () => {
    return (
        <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Wednesday, December 13th</AccordionTrigger>
        <AccordionContent className="day-container">
          <TripDetailCard />
          <TripDetailCard />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Thursday, December 14th</AccordionTrigger>
        <AccordionContent className="day-container">
            <TripDetailCard/>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Friday, December 15th</AccordionTrigger>
        <AccordionContent className="day-container">
            <TripDetailCard/>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    );
}

export default TripDetailsAccordion;