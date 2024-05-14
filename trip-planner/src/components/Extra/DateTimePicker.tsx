import * as React from "react";
import { DateTime } from "luxon";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectSingleEventHandler } from "react-day-picker";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export function DateTimePicker({
  date,
  setDate,
  startDate,
  endDate,
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] =
    React.useState<DateTime | null>(date ? DateTime.fromJSDate(date) : null);

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);
    setSelectedDateTime(selectedDay);
    setDate(selectedDay.toJSDate());
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const hours = Number.parseInt(value.split(":")[0] || "00", 10);
    const minutes = Number.parseInt(value.split(":")[1] || "00", 10);
    if (!selectedDateTime) {
      return;
    }
    const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });
    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const footer = (
    <div className="px-4 pt-0 pb-4">
      <Label>Time</Label>
      <Input
        className="w-full block"
        type="time"
        onChange={handleTimeChange}
        value={selectedDateTime ? selectedDateTime.toFormat("HH:mm") : ""}
      />
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild className="z-10">
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDateTime && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDateTime ? (
            selectedDateTime.toFormat("DDD HH:mm")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 left-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDateTime ? selectedDateTime.toJSDate() : undefined}
          onSelect={handleSelect}
          disabled={(date) =>
            (endDate && date > new Date(endDate)) ||
            (startDate && date < new Date(startDate))
              ? true
              : false
          }
          initialFocus
        />
        {footer}
      </PopoverContent>
    </Popover>
  );
}
