import React, { useEffect, useState } from "react";
import {
  Map,
  InfoWindow,
  Marker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import "./styles/google-map-extensions.css";

import { Button } from "../ui/button";
import { MapPin, Route, Search, Waypoints } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const center = {
  lat: -3.745,
  lng: -38.523,
};

const mapOptions = {
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

function MyComponent({ mapLocations } : any) {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(
    Object.keys(mapLocations)[0]
  );
  const [shouldRender, setShouldRender] = useState<any>(false);
  const [isGetRoutesDisabled, setIsGetRoutesDisabled] = useState<any>(false);
  const [travelMode, setTravelMode] = useState<any>("DRIVING");
 
  const handleMarkerClick = (marker: any) => {
    const newPosition = { lat: marker.lat, lng: marker.lng };
    map?.panTo(newPosition);
    smoothZoom(map, 14, map?.getZoom());
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const getBounds = () => {
    if (!window.google || !window.google.maps || !window.google.maps.LatLngBounds) {
      return null;
    }

    const bounds = new window.google.maps.LatLngBounds();
    mapLocations[selectedDay].forEach((location: any) => {
      bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
    });

    return {
      east: bounds.getNorthEast().lng(),
      north: bounds.getNorthEast().lat(),
      south: bounds.getSouthWest().lat(),
      west: bounds.getSouthWest().lng(),
    };
  };

  const rezoomToStartPosition = () => {
    const bounds = getBounds();
    if (!bounds) return;

    map?.fitBounds(bounds);
  };

  function smoothZoom(map: any, max: any, cnt: any) {
    if (cnt >= max) {
      return;
    } else {
      const z = google.maps.event.addListener(
        map,
        "zoom_changed",
        function (event: any) {
          google.maps.event.removeListener(z);
          smoothZoom(map, max, cnt + 1);
        }
      );
      setTimeout(function () {
        map.setZoom(cnt);
      }, 200);
    }
  }

  useEffect(() => {
    if (selectedDay && map) {
      setSelectedMarker(null);
      const bounds = getBounds();
      if (!bounds) return;

      map?.fitBounds(bounds);
    }
  }, [selectedDay, map]);


  const bounds = getBounds() || { east: 0, north: 0, south: 0, west: 0 };

  function formatMode(mode : any) {
    switch (mode) {
      case 'DRIVING':
        return 'Driving';
      case 'WALKING':
        return 'Walking';
      case 'BICYCLING':
        return 'Bicycling';
      default:
        return mode;
    }
  }

  return (
    <div>
      <div>
        <div className="map-filter-options">
          <Select value={travelMode} onValueChange={setTravelMode}>
            <SelectTrigger className="max-w-[150px] mb-2">
              <SelectValue placeholder="Select Travel Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Travel Mode</SelectLabel>
                {Object.keys(google.maps.TravelMode)
                  .filter(mode => mode !== "TWO_WHEELER" && mode !== "TRANSIT")
                  .map((mode: any) => (
                    <SelectItem value={mode} key={mode}>
                      {formatMode(mode)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="ml-2 mb-2" onClick={() => setShouldRender(true)} disabled={isGetRoutesDisabled}>
            <Route className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
          <Button onClick={() => rezoomToStartPosition()} className="ml-2 mb-2">
            <Search className="h-4 w-4 mr-2" />
            Fit all places on map
          </Button>
        </div>
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="mb-2">
            <SelectValue placeholder="Select Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Days</SelectLabel>
              {Object.keys(mapLocations).map((day: any) => (
                <SelectItem value={day} key={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
      </div>
      <Map
        defaultCenter={center}
        defaultZoom={9}
        className={"w-full h-[400px]"}
        scrollwheel={true}
        fullscreenControl={true}
        defaultBounds={{
          ...bounds
        }}
      >
        <Directions 
        mapLocations={mapLocations} 
        selectedDay={selectedDay} 
        shouldRender={shouldRender} 
        setShouldRender={setShouldRender}
        zoomToPlace={getBounds}
        setIsGetRoutesDisabled={setIsGetRoutesDisabled}
        travelMode={travelMode}
        />
        {mapLocations[selectedDay].map((location: any, index: any) => {
          return (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              title={location.title}
              onClick={() => handleMarkerClick(location)}
              label={(index + 1).toString()}
            />
          );
        })}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleCloseInfoWindow}
            pixelOffset={new window.google.maps.Size(0, -38)}
          >
            <div>
              <h2>{selectedMarker.title}</h2>
              <p>{selectedMarker.info}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

function Directions({ mapLocations, selectedDay, shouldRender, setShouldRender, zoomToPlace, setIsGetRoutesDisabled, travelMode } : any) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsRenderers, setDirectionsRenderers] = useState<any>([]);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  useEffect(() => {
    directionsRenderers.forEach((directionsRenderer: any) => { 
      directionsRenderer.setMap(null);
    });

    setIsGetRoutesDisabled(false);
    setRoutes([]);
  }, [selectedDay, travelMode]);

  useEffect(() => {
    if (!routesLibrary || !map || !shouldRender) return;

    const newDirectionsRenderers = mapLocations[selectedDay].map((_ : any, index : any) => {
      return new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true, preserveViewport: true});
    });

    setDirectionsRenderers(newDirectionsRenderers);
  }, [routesLibrary, map, mapLocations, selectedDay, shouldRender]);

  useEffect(() => {
    if (directionsRenderers.length === 0 || !mapLocations[selectedDay] || !shouldRender) return;

    const locations = mapLocations[selectedDay];

    for (let i = 0; i < locations.length - 1; i++) {
      const origin = locations[i];
      const destination = locations[i + 1];

      const directionsService = routesLibrary ? new routesLibrary.DirectionsService() : null;
      const directionsRenderer = directionsRenderers[i];

      directionsService?.route(
        {
          origin,
          destination,
          travelMode,
          provideRouteAlternatives: true,
        },
        (response: any, status: any) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
            setRoutes(prevRoutes => [...prevRoutes, ...response.routes]);
            setShouldRender(false);
            map?.fitBounds(zoomToPlace());
            setIsGetRoutesDisabled(true);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [directionsRenderers, mapLocations, selectedDay]);

  console.log(routes);

  return null;
}


export default React.memo(MyComponent);
