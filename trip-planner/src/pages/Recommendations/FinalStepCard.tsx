import { CirclePlus, Clock, Star } from "lucide-react";
import "./styles/final-step-card.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FinalStepCard = ({ recommendations }: any) => {
  const fakeRecommendations = [
    {
      category: "Restaurant",
      recommendations: [
        {
          place: {
            types: ["restaurant", "food", "point_of_interest", "establishment"],
            googleMapsUri: "https://maps.google.com/?cid=17414244102744508168",
            rating: 4.2,
            userRatingCount: 2361,
            displayName: "Maxima",
            formattedAddress: "Gedimino pr. 15, 01103 Vilnius, Lithuania",
            internationalPhoneNumber: "+370 685 42178",
          },
          photoUri:
            "https://lh5.googleusercontent.com/p/AF1QipN5AEi2bMtDjqxOaEiDfoI1PpxImN09VaLzY9Ll=w426-h240-k-no",
        },
        {
          place: {
            types: [
              "bar",
              "restaurant",
              "food",
              "point_of_interest",
              "establishment",
            ],
            googleMapsUri: "https://maps.google.com/?cid=13072797660899160115",
            rating: 5,
            userRatingCount: 3,
            displayName: "Maxima",
            formattedAddress: "Gedimino pr. 15, 01103 Vilnius, Lithuania",
            internationalPhoneNumber: "+370 685 42178",
          },
          photoUri:
            "https://lh5.googleusercontent.com/p/AF1QipN5AEi2bMtDjqxOaEiDfoI1PpxImN09VaLzY9Ll=w426-h240-k-no",
        },
        {
          place: {
            types: ["restaurant", "food", "point_of_interest", "establishment"],
            googleMapsUri: "https://maps.google.com/?cid=9728082230136419360",
            rating: 3.8,
            userRatingCount: 942,
            displayName: "Maxima",
            formattedAddress: "Gedimino pr. 15, 01103 Vilnius, Lithuania",
            internationalPhoneNumber: "+370 685 42178",
          },
          photoUri:
            "https://lh5.googleusercontent.com/p/AF1QipN5AEi2bMtDjqxOaEiDfoI1PpxImN09VaLzY9Ll=w426-h240-k-no",
        },
      ],
    },
    {
      category: "Supermarket",
      recommendations: [
        {
          place: {
            types: [
              "shopping_mall",
              "supermarket",
              "grocery_store",
              "store",
              "point_of_interest",
              "food",
              "establishment",
            ],
            googleMapsUri: "https://maps.google.com/?cid=7978381592158670564",
            rating: 4.5,
            userRatingCount: 4775,
            displayName: "Maxima",
            formattedAddress: "Gedimino pr. 15, 01103 Vilnius, Lithuania",
            internationalPhoneNumber: "+370 685 42178",
          },
          photoUri:
            "https://lh5.googleusercontent.com/p/AF1QipN5AEi2bMtDjqxOaEiDfoI1PpxImN09VaLzY9Ll=w426-h240-k-no",
        },
        {
          place: {
            types: [
              "shopping_mall",
              "supermarket",
              "grocery_store",
              "store",
              "point_of_interest",
              "food",
              "establishment",
            ],
            googleMapsUri: "https://maps.google.com/?cid=5121442863491631294",
            rating: 4.4,
            userRatingCount: 2062,
            displayName: "Maxima",
            formattedAddress: "Gedimino pr. 15, 01103 Vilnius, Lithuania",
            internationalPhoneNumber: "+370 685 42178",
          },
          photoUri:
            "https://lh5.googleusercontent.com/p/AF1QipN5AEi2bMtDjqxOaEiDfoI1PpxImN09VaLzY9Ll=w426-h240-k-no",
        },
        {
          place: {
            types: [
              "supermarket",
              "grocery_store",
              "store",
              "point_of_interest",
              "food",
              "establishment",
            ],
            googleMapsUri: "https://maps.google.com/?cid=14198905206903018757",
            rating: 5,
            userRatingCount: 1,
            displayName: "Maxima",
            formattedAddress: "Gedimino pr. 15, 01103 Vilnius, Lithuania",
            internationalPhoneNumber: "+370 685 42178",
          },
          photoUri: null,
        },
      ],
    },
  ];

  return (
    <div className="items-center justify-center my-2 border bg-secondary text-primary rounded-md">
      <div className="p-8">
        <h1 className="text-2xl font-bold ml-2">Recommendations</h1>
        {recommendations.map((recommendation: any) => (
          <div key={recommendation.category}>
            <h2 className="text-xl font-bold mt-4 ml-2">
              {recommendation.category.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <div className="flex-1 flex flex-wrap">
              {recommendation.recommendations && recommendation.recommendations.length > 0 ? (recommendation.recommendations.map((rec: any) => (
                <div
                  key={rec.place.googleMapsUri}
                  className="flex-1 m-2 border bg-gray-100 rounded-md max-w-[500px]"
                >
                  <img
                    src={rec.photoUri || "/avatar-placeholder.png"}
                    alt="place"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <a
                      href={rec.place.googleMapsUri}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <h2 className="final-card-title">
                        {rec.place.displayName}
                      </h2>
                    </a>
                    <div className="w-full flex flex-wrap gap-1 mt-1 mb-2">
                      {rec.place.types.slice(0, 4).map(
                        (type: any, index: any) =>
                          index <= 3 && (
                            <Badge key={type}>
                              <p className="flex justify-end items-end">{type.split('_').map((word : any) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            </Badge>
                          )
                      )}
                    </div>
                    <p className="address-text">{rec.place.formattedAddress}</p>
                    <span className="text-md flex items-center">
                      <Star fill="#E49B0F" strokeWidth={0} />
                      <p className="rating-text">
                        {rec.place.rating} ({rec.place.userRatingCount} reviews)
                      </p>
                    </span>
                    <div className="w-full mt-4 flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline">
                        <Clock className="mr-2 h-4 w-4" />
                        Working Hours
                      </Button>
                      <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        Reviews
                      </Button>
                      <Button variant="outline" size="sm">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add To Trip
                      </Button>
                    </div>
                  </div>
                </div>
              ))) : (
                <p className="ml-2 text-md ">No places were found. Try increasing the range or writing a more specific address</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalStepCard;
