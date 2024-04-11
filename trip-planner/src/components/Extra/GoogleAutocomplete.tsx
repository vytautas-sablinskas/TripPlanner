import { cn } from "@/lib/utils";
import "./styles/google-autocomplete.css";
import Autocomplete from "react-google-autocomplete";
import { useEffect, useState } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const GoogleAutocomplete = ({ className, onSelect, value, types, fields } : any) => {
    const [options, setOptions] = useState<any>({
        types: ["address"],
    });

    const {
        placesService
    } = usePlacesService({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    })

    useEffect(() => {
        const updatedOptions : any = {};
        if (types !== undefined) {
            updatedOptions.types = types;
        }
        if (fields !== undefined) {
            updatedOptions.fields = fields;
        }
        setOptions(updatedOptions);
    }, [types, fields])

    return (
        <Autocomplete 
            apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            key={options.types}
            onPlaceSelected={(place) => {
                onSelect(place);
                placesService.getDetails(
                    { 
                        placeId: place.place_id,
                        fields: ["overview"]
                    }, 
                    (place : any) => {console.log(place)})

                console.log(place);
            }}
            options={options}
            onChange={() => {
                onSelect({ formatted_address: "" });
            }}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            defaultValue={value || ""}
        />
    )
}

export default GoogleAutocomplete;