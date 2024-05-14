import GoogleAutocomplete from "@/components/Extra/GoogleAutocomplete";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FirstStepCard = ({
  setGeometry,
  address,
  setAddress,
  radius,
  setRadius,
  addressError,
}: any) => {
  const [autocompleteSearchType, setAutocompleteSearchType] =
    useState("geocode");

  return (
    <div className="sm:w-[600px] flex flex-col my-2 border bg-secondary text-primary rounded-md">
      <div className="w-full p-8">
        <div className="flex justify-between items-end mb-1">
          <Label required>Enter Location</Label>
          <Select
            onValueChange={setAutocompleteSearchType}
            value={autocompleteSearchType}
          >
            <SelectTrigger className="max-w-[130px]">
              <SelectValue placeholder="Select Destination Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="geocode">By Location</SelectItem>
                <SelectItem value="establishment">By Places</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <GoogleAutocomplete
          onSelect={(place: any) => {
            setGeometry({
              latitude: place?.geometry?.location?.lat(),
              longitude: place?.geometry?.location?.lng(),
            });
            setAddress(place.formatted_address);
          }}
          fields={["geometry.location", "formatted_address"]}
          value={address}
          types={[autocompleteSearchType]}
        />
        {addressError && (
          <p className="text-red-500 text-sm mt-2">
            Please enter a valid address
          </p>
        )}
        <div className="w-full flex justify-between mt-4">
          <Label required>Radius</Label>
          <Label>{radius} Meters</Label>
        </div>
        <Slider
          min={500}
          max={5000}
          step={1}
          defaultValue={[radius]}
          onValueChange={(value: any) => {
            setRadius(value);
          }}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default FirstStepCard;
