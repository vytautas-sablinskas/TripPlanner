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
import { Route, Search } from "lucide-react";
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

function MyComponent({ mapLocations } : any) {
  const map = useMap();
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(
    Object.keys(mapLocations)[0]
  );
  const [shouldRender, setShouldRender] = useState<any>(false);
  const [isGetRoutesDisabled, setIsGetRoutesDisabled] = useState<any>(false);
  const [travelMode, setTravelMode] = useState<any>("WALKING");
  const [distance, setDistance] = useState<any>(null);
  const [duration, setDuration] = useState<any>(null);
  const [isZoomedIn, setIsZoomedIn] = useState<any>(false);
 
  const handleMarkerClick = (marker: any) => {
    const newPosition = { lat: marker.lat, lng: marker.lng };
    setIsZoomedIn(false);
    map?.panTo(newPosition);
    smoothZoom(map, 14, map?.getZoom());
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const getBounds = () => {
    const defaultValues = { east: 0, north: 0, south: 0, west: 0 };

    if (!window.google || !window.google.maps || !window.google.maps.LatLngBounds || !selectedDay || !mapLocations || !mapLocations[selectedDay]) {
      return defaultValues;
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
      setTimeout(() => {
        setIsZoomedIn(true);
      }, 200)
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
      }, 150);
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
      default:
        return mode;
    }
  }

  const onGetDirections = () => {
    if (!selectedDay || !mapLocations[selectedDay] || mapLocations[selectedDay].length <= 1) return;

    setShouldRender(true);
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
                  .reverse()
                  .filter(mode => mode !== "TWO_WHEELER" && mode !== "TRANSIT" && mode !== "BICYCLING")
                  .map((mode: any) => (
                    <SelectItem value={mode} key={mode}>
                      {formatMode(mode)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="ml-2 mb-2" onClick={() => onGetDirections()} disabled={isGetRoutesDisabled}>
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
        selectedMarker={selectedMarker}
        setDistance={setDistance}
        setDuration={setDuration}
        />
        {mapLocations[selectedDay] && mapLocations[selectedDay].map((location: any, index: any) => {
          return (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              title={location.title}
              onClick={() => handleMarkerClick(location)}
              label={(index + 1).toString()}
            />
          );
        })}
        {(selectedMarker && isZoomedIn) && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleCloseInfoWindow}
            pixelOffset={new window.google.maps.Size(0, -38)}
          >
            <div>
              <h2>{selectedMarker.title}</h2>
              {(duration && distance) &&
                <p>{duration}, {distance}</p>
              }
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

function Directions({ mapLocations, selectedDay, shouldRender, setShouldRender, zoomToPlace, setIsGetRoutesDisabled, travelMode, selectedMarker, setDistance, setDuration } : any) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [route, setRoute] = useState<google.maps.DirectionsRoute | null>(null);

  useEffect(() => {
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }

    setShouldRender(false);
    setDistance(null);
    setRoute(null);
    setDuration(null);
    setIsGetRoutesDisabled(false);
  }, [selectedMarker, travelMode]);

  useEffect(() => {
    if (route || mapLocations[selectedDay]?.findIndex((location: any) => location === selectedMarker) === mapLocations[selectedDay]?.length - 1) {
      setShouldRender(false);
      return;
    }

    if (!routesLibrary || !map || !shouldRender || !selectedMarker) return;

    const origin = selectedMarker;
    const destinationIndex = mapLocations[selectedDay].findIndex((location: any) => location === selectedMarker) + 1;

    const destination = mapLocations[selectedDay][destinationIndex];

    const directionsService = new routesLibrary.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode,
        optimizeWaypoints: true,
      },
      (response: any, status: any) => {
        if (status === "OK") {
          const route = response.routes[0];
          const leg = route.legs[0];

          setRoute(route);
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);

          if (directionsRenderer) {
            directionsRenderer.setMap(null);
          }

          const newDirectionsRenderer = new routesLibrary.DirectionsRenderer({ map, suppressMarkers: true, preserveViewport: true });
          newDirectionsRenderer.setDirections(response);
          setDirectionsRenderer(newDirectionsRenderer);

          setShouldRender(false);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  }, [shouldRender]);

  return null;
}


export default React.memo(MyComponent);
