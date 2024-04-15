import RecommendationCategories from "./RecommendationCategories";

const SecondStepCard = ({
  categoryErrorMessage,
  categories,
  setCategories,
  setCategoryErrorMessage,
  selectedRating,
  setSelectedRating,
  selectedRatingCount,
  setSelectedRatingCount,
  selectedPrice,
  setSelectedPrice,
  selectedDistance,
  setSelectedDistance,
  enabled,
  setEnabled
} : any) => {
    return (
        <div className="my-2 border bg-secondary text-primary rounded-md">
          <RecommendationCategories 
            categoryErrorMessage={categoryErrorMessage}
            selectedCategory={categories}
            setSelectedCategory={setCategories}
            setCategoryErrorMessage={setCategoryErrorMessage}
            selectedRating={selectedRating}
            selectedRatingCount={selectedRatingCount}
            selectedDistance={selectedDistance}
            setSelectedRating={setSelectedRating}
            setSelectedRatingCount={setSelectedRatingCount}
            setSelectedDistance={setSelectedDistance}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            enabled={enabled}
            setEnabled={setEnabled}
          />
        </div>
      );
}

export default SecondStepCard;