import { Card, CardContent } from "@/components/ui/card";
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
} : any) => {
    const MAX_CATEGORIES_SELECTED = 3;

    const onCategorySelect = (id: any) => {
        if (categoryErrorMessage) {
            setCategoryErrorMessage(null);
        }

        if (selectedCategory.includes(id)) {
            setSelectedCategory((prev: any) => {
                return prev.filter((category: any) => category !== id);
            })

            return;
        }

        if (selectedCategory.length === MAX_CATEGORIES_SELECTED) {
            return;
        }

        setSelectedCategory((prev: any) => {
            return [...prev, id];
        })
    }

    const categories = [
        {
            id: 0,
            name: "Restaurants",
            icon: "🍔"
        },
        {
            id: 1,
            name: "Amusement Parks",
            icon: "🏨"
        },
        {
            id: 2,
            name: "Aquariums",
            icon: "🚗"
        },
        {
            id: 3,
            name: "Art Galleries",
            icon: "🎢"
        },
        {
            id: 4,
            name: "Bakeries",
            icon: "🍔"
        },
        {
            id: 5,
            name: "Cafes",
            icon: "🏨"
        },
        {
            id: 6,
            name: "Casinos",
            icon: "🚗"
        },
        {
            id: 7,
            name: "Churches",
            icon: "🎢"
        },
        {
            id: 8,
            name: "Libraries",
            icon: "🏨"
        },
        {
            id: 9,
            name: "Museums",
            icon: "🚗"
        },
        {
            id: 10,
            name: "Night Clubs",
            icon: "🎢"
        },
        {
            id: 11,
            name: "Parks",
            icon: "🏨"
        },
        {
            id: 12,
            name: "Super Markets",
            icon: "🚗"
        },
        {
            id: 13,
            name: "Tourist Attractions",
            icon: "🎢"
        }
    ]

    const cardBackgroundColor = (id : any) => {
        if (selectedCategory.includes(id)) {
            return "bg-red-100";
        }

        if (selectedCategory.length === MAX_CATEGORIES_SELECTED) {
            return "bg-gray-100";
        }

        return "";
    }

    return (
        <div className="sm:max-w-[700px] min-w-[300px] p-8 flex-wrap">
            <Label className="ml-2 text-xl font-bold">Select up to {MAX_CATEGORIES_SELECTED} categories</Label>
            <div className="flex flex-wrap my-3">
                {categories.map((category : any) => (
                    <Card key={category.id} className={`flex-1 m-2 p-4 cursor-pointer ${cardBackgroundColor(category.id)}`} onClick={() => onCategorySelect(category.id)}>
                        <CardContent className="!p-0 flex justify-center h-full items-center">
                            <p className="mr-2">{category.icon}</p>
                            {category.name}
                        </CardContent>
                    </Card>
                ))}
            </div>
            {categoryErrorMessage && <p className="text-red-500 ml-2">{categoryErrorMessage}</p>}
            <div>
                <div className="flex flex-col ml-2 mt-2">
                    <Label className="mb-2 text-xl font-bold">Place Rating Importance</Label>
                    <RadioGroup orientation="horizontal" className="flex flex-wrap" value={selectedRating} onValueChange={setSelectedRating}>
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
                </div>
                <div className="flex flex-col ml-2 mt-6">
                    <Label className="mb-2 text-xl font-bold">Count Of Place Ratings Importance</Label>
                    <RadioGroup orientation="horizontal" className="flex flex-wrap" value={selectedRatingCount} onValueChange={setSelectedRatingCount}>
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
                </div>
                <div className="flex flex-col ml-2 mt-6">
                    <Label className="mb-2 text-xl font-bold">Distance From Selected Location Importance</Label>
                    <RadioGroup orientation="horizontal" className="flex flex-wrap" value={selectedDistance} onValueChange={setSelectedDistance}>
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
                </div>
                <div className="flex flex-col ml-2 mt-6">
                    <Label className="mb-2 text-xl font-bold">Price Range Preference</Label>
                    <RadioGroup orientation="horizontal" className="flex flex-wrap" value={selectedPrice} onValueChange={setSelectedPrice}>
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
                </div>
            </div>
        </div>
    )
}

export default RecommendationCategories;