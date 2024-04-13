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
    setSelectedDistance
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
            name: "Food",
            icon: "🍔"
        },
        {
            id: 1,
            name: "Accommodation",
            icon: "🏨"
        },
        {
            id: 2,
            name: "Transportation",
            icon: "🚗"
        },
        {
            id: 3,
            name: "Activities",
            icon: "🎢"
        },
        {
            id: 4,
            name: "Food",
            icon: "🍔"
        },
        {
            id: 5,
            name: "Accommodation",
            icon: "🏨"
        },
        {
            id: 6,
            name: "Transportation",
            icon: "🚗"
        },
        {
            id: 7,
            name: "Activities",
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
                        <CardContent className="!p-0 flex justify-center">
                            <p className="mr-2">{category.icon}</p>
                            <p>{category.name}</p>
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
            </div>
        </div>
    )
}

export default RecommendationCategories;