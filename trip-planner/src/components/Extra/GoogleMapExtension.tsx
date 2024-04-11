import React, { useCallback, useState } from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: -3.745,
    lng: -38.523,
};

const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      },
    ]
  };

const mapLocations = [
  { lat: -3.755, lng: -38.533, title: "Location 1", info: "Test" },
  { lat: -3.765, lng: -38.543, title: "Location 2", info: "Test2" },
];

function MyComponent() {
    function smoothZoom (map : any, max : any, cnt : any) {
        if (cnt >= max) {
            return;
        }
        else {
            const z = google.maps.event.addListener(map, 'zoom_changed', function(event : any){
                google.maps.event.removeListener(z);
                smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function(){map.setZoom(cnt)}, 200);
        }
    }  

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const [map, setMap] = useState<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const handleMarkerClick = (marker: any) => {
    const newPosition = { lat: marker.lat, lng: marker.lng };
    map?.panTo(newPosition);
    smoothZoom(map, 14, map.getZoom());
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const getBounds = () => {
    const bounds = new window.google.maps.LatLngBounds();
    mapLocations.forEach((location) => {
      bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
    });

    return bounds;
  }

  const rezoomToStartPosition = () => {
    map?.fitBounds(getBounds());
  }

  const onLoad = useCallback(function callback(map: any) {
    map.fitBounds(getBounds());

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div>
        <div className="flex justify-end">
            <Button onClick={() => rezoomToStartPosition()} className="mb-2">
                <Search className="h-4 w-4 mr-2"/>
                Fit all places on map
            </Button>
        </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {mapLocations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.title}
            onClick={() => handleMarkerClick(location)}
            label={(index + 1).toString()}
          />
        ))}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={handleCloseInfoWindow}
            options={{pixelOffset: new google.maps.Size(0,-30)}}
          >
            <div>
              <h2>{selectedMarker.title}</h2>
              <p>{selectedMarker.info}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);
