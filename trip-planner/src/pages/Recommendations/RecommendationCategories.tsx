import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RecommendationCategories = ({
  categoryErrorMessage,
  setCategoryErrorMessage,
  selectedCategory,
  setSelectedCategory,
  selectedRating,
  setSelectedRating,
  selectedRatingCount,
  setSelectedRatingCount,
  selectedDistance,
  setSelectedDistance,
  selectedPrice,
  setSelectedPrice,
  enabled,
  setEnabled,
}: any) => {
  const MAX_CATEGORIES_SELECTED = 3;

  const onCategorySelect = (id: any) => {
    if (categoryErrorMessage) {
      setCategoryErrorMessage(null);
    }

    if (selectedCategory.includes(id)) {
      setSelectedCategory((prev: any) => {
        return prev.filter((category: any) => category !== id);
      });

      return;
    }

    if (selectedCategory.length === MAX_CATEGORIES_SELECTED) {
      return;
    }

    setSelectedCategory((prev: any) => {
      return [...prev, id];
    });
  };

  const categories = [
    {
      id: 0,
      name: "Restaurants",
      icon: "/recommendations/restaurant-48.png",
    },
    {
      id: 1,
      name: "Amusement Parks",
      icon: "/recommendations/amusement-park-48.png",
    },
    {
      id: 2,
      name: "Aquariums",
      icon: "/recommendations/aquarium-48.png",
    },
    {
      id: 3,
      name: "Art Galleries",
      icon: "/recommendations/physical-gallery-48.png",
    },
    {
      id: 4,
      name: "Bakeries",
      icon: "/recommendations/bakery-48.png",
    },
    {
      id: 5,
      name: "Cafes",
      icon: "/recommendations/cafe-48.png",
    },
    {
      id: 6,
      name: "Casinos",
      icon: "/recommendations/casino-48.png",
    },
    {
      id: 7,
      name: "Churches",
      icon: "/recommendations/church-48.png",
    },
    {
      id: 8,
      name: "Libraries",
      icon: "/recommendations/library-48.png",
    },
    {
      id: 9,
      name: "Museums",
      icon: "/recommendations/museum-48.png",
    },
    {
      id: 10,
      name: "Night Clubs",
      icon: "/recommendations/disco-ball-48.png",
    },
    {
      id: 11,
      name: "Parks",
      icon: "/recommendations/park-48.png",
    },
    {
      id: 12,
      name: "Super Markets",
      icon: "/recommendations/shopping-cart-48.png",
    },
    {
      id: 13,
      name: "Tourist Attractions",
      icon: "/recommendations/tourist-48.png",
    },
  ];

  const cardBackgroundColor = (id: any) => {
    if (selectedCategory.includes(id)) {
      return "bg-blue-300";
    }

    if (selectedCategory.length === MAX_CATEGORIES_SELECTED) {
      return "bg-gray-300";
    }

    return "";
  };

  console.log(enabled);

  return (
    <div className="sm:max-w-[700px] min-w-[300px] p-8 flex-wrap">
      <Label className="ml-2 text-xl font-bold">
        Select up to {MAX_CATEGORIES_SELECTED} categories
      </Label>
      <div className="flex flex-wrap my-3">
        {categories.map((category: any) => (
          <Card
            key={category.id}
            className={`flex-1 m-2 p-4 cursor-pointer ${cardBackgroundColor(
              category.id
            )}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="!p-0 flex justify-center h-full items-center">
              <img src={category.icon} alt="icon" className="mr-2 w-6 h-6" />
              {category.name}
            </CardContent>
          </Card>
        ))}
      </div>
      {categoryErrorMessage && (
        <p className="text-red-500 ml-2">{categoryErrorMessage}</p>
      )}
      <div>
        <div className="flex flex-col ml-2 mt-2">
          <div className="flex space-x-2 mb-2 items-center">
            <Label className="text-xl font-bold">Place Rating Importance</Label>
            <Checkbox
              id="terms"
              checked={enabled.find((e: any) => e.id === "rating").isEnabled}
              onCheckedChange={(value) => {
                if (value) {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "rating") {
                        return { ...option, isEnabled: true };
                      } else {
                        return option;
                      }
                    })
                  );
                } else {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "rating") {
                        return { ...option, isEnabled: false };
                      } else {
                        return option;
                      }
                    })
                  );
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable
            </label>
          </div>
          {enabled.find((e: any) => e.id === "rating").isEnabled && (
            <RadioGroup
              orientation="horizontal"
              className="flex flex-wrap"
              value={selectedRating}
              onValueChange={setSelectedRating}
            >
              <div className="flex items-center space-x-2 mr-2">
                <RadioGroupItem value="30" id="30" />
                <Label htmlFor="option-one">Not Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="60" />
                <Label htmlFor="option-two">Moderately Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="90" id="90" />
                <Label htmlFor="option-two">Important</Label>
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="flex flex-col ml-2 mt-6">
          <div className="flex space-x-2 mb-2 items-center">
            <Label className="text-xl font-bold">
              Count Of Place Ratings Importance
            </Label>
            <Checkbox
              id="terms"
              checked={
                enabled.find((e: any) => e.id === "ratingCount").isEnabled
              }
              onCheckedChange={(value) => {
                if (value) {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "ratingCount") {
                        return { ...option, isEnabled: true };
                      } else {
                        return option;
                      }
                    })
                  );
                } else {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "ratingCount") {
                        return { ...option, isEnabled: false };
                      } else {
                        return option;
                      }
                    })
                  );
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable
            </label>
          </div>
          {enabled.find((e: any) => e.id === "ratingCount").isEnabled && (
            <RadioGroup
              orientation="horizontal"
              className="flex flex-wrap"
              value={selectedRatingCount}
              onValueChange={setSelectedRatingCount}
            >
              <div className="flex items-center space-x-2 mr-2">
                <RadioGroupItem value="30" id="30" />
                <Label htmlFor="option-one">Not Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="60" />
                <Label htmlFor="option-two">Moderately Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="90" id="90" />
                <Label htmlFor="option-two">Important</Label>
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="flex flex-col ml-2 mt-6">
          <div className="flex space-x-2 mb-2 items-center">
            <Label className="text-xl font-bold">
              Distance From Selected Location Importance
            </Label>
            <Checkbox
              id="terms"
              checked={enabled.find((e: any) => e.id === "distance").isEnabled}
              onCheckedChange={(value) => {
                if (value) {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "distance") {
                        return { ...option, isEnabled: true };
                      } else {
                        return option;
                      }
                    })
                  );
                } else {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "distance") {
                        return { ...option, isEnabled: false };
                      } else {
                        return option;
                      }
                    })
                  );
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable
            </label>
          </div>
          {enabled.find((e: any) => e.id === "distance").isEnabled && (
            <RadioGroup
              orientation="horizontal"
              className="flex flex-wrap"
              value={selectedDistance}
              onValueChange={setSelectedDistance}
            >
              <div className="flex items-center space-x-2 mr-2">
                <RadioGroupItem value="30" id="30" />
                <Label htmlFor="option-one">Not Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="60" id="60" />
                <Label htmlFor="option-two">Moderately Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="90" id="90" />
                <Label htmlFor="option-two">Important</Label>
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="flex flex-col ml-2 mt-6">
          <div className="flex space-x-2 mb-2 items-center">
            <Label className="text-xl font-bold">Price Range Preference</Label>
            <Checkbox
              id="terms"
              checked={enabled.find((e: any) => e.id === "price").isEnabled}
              onCheckedChange={(value) => {
                if (value) {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "price") {
                        return { ...option, isEnabled: true };
                      } else {
                        return option;
                      }
                    })
                  );
                } else {
                  setEnabled((prev: any) =>
                    prev.map((option: any) => {
                      if (option.id === "price") {
                        return { ...option, isEnabled: false };
                      } else {
                        return option;
                      }
                    })
                  );
                }
              }}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable
            </label>
          </div>
          {enabled.find((e: any) => e.id === "price").isEnabled && (
            <RadioGroup
              orientation="horizontal"
              className="flex flex-wrap"
              value={selectedPrice}
              onValueChange={setSelectedPrice}
            >
              <div className="flex items-center space-x-2 mr-2">
                <RadioGroupItem value="0" id="0" />
                <Label htmlFor="option-one">Free</Label>
              </div>
              <div className="flex items-center space-x-2 mr-2">
                <RadioGroupItem value="1" id="1" />
                <Label htmlFor="option-one">Inexpensive</Label>
              </div>
              <div className="flex items-center space-x-2 mr-2">
                <RadioGroupItem value="2" id="2" />
                <Label htmlFor="option-one">Moderate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="3" />
                <Label htmlFor="option-two">Expensive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="4" />
                <Label htmlFor="option-two">Very Expensive</Label>
              </div>
            </RadioGroup>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCategories;
