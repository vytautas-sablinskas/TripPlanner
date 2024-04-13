import { Button } from "@/components/ui/button";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import FirstStepCard from "./FirstStepCard";
import SecondStepCard from "./SecondStepCard";
import FinalStepCard from "./FinalStepCard";
import { useEffect, useState } from "react";

const steps = [
  { label: "Select Location" },
  { label: "Select Filters" },
  { label: "Recommendations" },
];

export default function Recommendations() {
  const [geometry, setGeometry] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [addressError, setAddressError] = useState<any>(null);
  const [categoryError, setCategoryError] = useState<any>(null);
  const [radius, setRadius] = useState(500);
  const [categories, setCategories] = useState<any>([]);
  const [selectedRating, setSelectedRating] = useState<any>("60");
  const [selectedRatingCount, setSelectedRatingCount] = useState<any>("60");
  const [selectedDistance, setSelectedDistance] = useState<any>("60");

  const getStepCard = (index: number) => {
    switch (index) {
      case 0:
        return <FirstStepCard 
            geometry={geometry} 
            setGeometry={setGeometry} 
            address={address} 
            setAddress={setAddress}
            radius={radius}
            setRadius={setRadius}
            addressError={addressError}
        />;
      case 1:
        return <SecondStepCard 
            categoryErrorMessage={categoryError}
            categories={categories}
            setCategories={setCategories}
            setCategoryErrorMessage={setCategoryError}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedRatingCount={selectedRatingCount}
            setSelectedRatingCount={setSelectedRatingCount}
            selectedDistance={selectedDistance}
            setSelectedDistance={setSelectedDistance}
        />;
      case 2:
        return <FinalStepCard />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex sm:min-w-[600px] flex-col gap-4">
        <Stepper initialStep={1} steps={steps}>
          {steps.map((stepProps, index) => {
            return (
              <Step key={stepProps.label} {...stepProps}>
                {getStepCard(index)}
              </Step>
            );
          })}
          <Footer 
            geometry={geometry} 
            address={address} 
            categories={categories}
            setCategoryError={setCategoryError}
            setAddressError={setAddressError}
            dto={{
              ratingWeight: Number(selectedRating),
              ratingCountWeight: Number(selectedRatingCount),
              distanceWeight: Number(selectedDistance),
              categories,
              latitude: geometry?.latitude,
              longitude: geometry?.longitude,
              radius
            }}
          />
        </Stepper>
      </div>
    </div>
  );
}

const Footer = ({ geometry, address, setAddressError, categories, setCategoryError, dto } : any) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
    currentStep,
  } = useStepper();

  const onNextStep = () => {
    if (currentStep.label === "Select Location" && (!geometry || !address || address.length === 0)) {
      setAddressError("Please select a location");
    }

    if (currentStep.label === "Select Filters" && (!categories || categories.length === 0)) {
      setCategoryError("Please select at least one category");
    }

    if (currentStep.label === "Select Filters") {
      console.log(dto);
    }

    
    setAddressError(null);
    nextStep();
  };

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
              type="button"
            >
              Prev
            </Button>
            <Button size="sm" onClick={onNextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
