import GoogleAutocomplete from "@/components/Extra/GoogleAutocomplete";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Slider } from "@/components/ui/slider"

const FirstStepCard = ({ setGeometry, address, setAddress, radius, setRadius, addressError }: any) => {
  const [autocompleteSearchType, setAutocompleteSearchType] = useState("geocode");

  return (
    <div className="flex flex-col my-2 border bg-secondary text-primary rounded-md">
      <div className="w-full p-8">
        <Label required>Enter Location</Label>
        <GoogleAutocomplete
            onSelect={(place: any) => {
                console.log(place);
                setGeometry({
                    latitude: place?.geometry?.location?.lat(),
                    longitude: place?.geometry?.location?.lng(),
                });
                setAddress(place.formatted_address);
            }}
            fields={[
                "geometry.location",
                "formatted_address",
            ]}
            value={address}
            types={[autocompleteSearchType]}
        />
        {addressError && (
            <p className="text-red-500 text-sm mt-2">Please enter a valid address</p>
        )}
        <div className="w-full flex justify-between mt-4">
            <Label required>Radius</Label>
            <Label>{radius} Meters</Label>
        </div>
        <Slider
            min={500}
            max={3000}
            step={1}
            defaultValue={[radius]}
            onValueChange={(value : any) => {
                setRadius(value);
            }}
            className="mt-4"
        />
      </div>
    </div>
  );
};

export default FirstStepCard;
