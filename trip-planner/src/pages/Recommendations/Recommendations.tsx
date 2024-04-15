import { Button } from "@/components/ui/button";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import FirstStepCard from "./FirstStepCard";
import SecondStepCard from "./SecondStepCard";
import FinalStepCard from "./FinalStepCard";
import { useState } from "react";
import { CreateEditLoadingButton } from "@/components/Extra/LoadingButton";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { getRecommendations } from "@/api/RecommendationService";

const steps = [
  { label: "Select Location" },
  { label: "Select Filters" },
];

export default function Recommendations() {
  const [geometry, setGeometry] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [addressError, setAddressError] = useState<any>(null);
  const [categoryError, setCategoryError] = useState<any>(null);
  const [radius, setRadius] = useState<any>(500);
  const [categories, setCategories] = useState<any>([]);
  const [selectedRating, setSelectedRating] = useState<any>("60");
  const [selectedRatingCount, setSelectedRatingCount] = useState<any>("60");
  const [selectedDistance, setSelectedDistance] = useState<any>("60");
  const [selectedPrice, setSelectedPrice] = useState<any>("2");
  const [isDataLoading, setIsDataLoading] = useState<any>(false);
  const [recommendations, setRecommendations] = useState<any>([]);
  const [enabled, setEnabled] = useState<any>([
    { id: "rating", isEnabled: true },
    { id: "ratingCount", isEnabled: true },
    { id: "distance", isEnabled: true },
    { id: "price", isEnabled: true }
  ]);


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
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            enabled={enabled}
            setEnabled={setEnabled}
        />;
      default:
        return null;
    }
  };

  const onFormReset = () => {
    setGeometry(null);
    setAddress(null);
    setAddressError(null);
    setCategoryError(null);
    setCategories([]);
    setRadius(500);
    setSelectedRating("60");
    setSelectedRatingCount("60");
    setSelectedDistance("60");
    setSelectedPrice("2");
    setIsDataLoading(false);
    setRecommendations([]);
    setEnabled([
      { id: "rating", isEnabled: true },
      { id: "ratingCount", isEnabled: true },
      { id: "distance", isEnabled: true },
      { id: "price", isEnabled: true }
    ])
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-4">
        <Stepper initialStep={0} steps={steps}>
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
              ratingWeight: enabled.find((e : any) => e.id === "rating")?.isEnabled ? Number(selectedRating) / 100 : 0,
              ratingCountWeight: enabled.find((e : any) => e.id === "ratingCount")?.isEnabled ? Number(selectedRatingCount) / 100 : 0,
              distanceWeight: enabled.find((e : any) => e.id === "distance")?.isEnabled ? Number(selectedDistance) / 100 : 0,
              categories: categories.map((category: any) => Number(category)),
              latitude: geometry?.latitude,
              longitude: geometry?.longitude,
              radius: radius[0],
              priceLevel: enabled.find((e : any) => e.id === "distance")?.isEnabled ? Number(selectedPrice) : 6
            }}
            isDataLoading={isDataLoading}
            setIsDataLoading={setIsDataLoading}
            recommendations={recommendations}
            setRecommendations={setRecommendations}
            onFormReset={onFormReset}
            enabled={enabled}
          />
        </Stepper>
      </div>
    </div>
  );
}

const Footer = ({ geometry, address, setAddressError, categories, setCategoryError, dto, isDataLoading, setIsDataLoading, recommendations, setRecommendations, onFormReset, enabled } : any) => {
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
  const { changeUserInformationToLoggedIn, changeUserInformationToLoggedOut } = useUser();
  const navigate = useNavigate();

  const tryGettingRecommendations = async () => {
    setIsDataLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!checkTokenValidity(accessToken || "")) {
        const result = await refreshAccessToken();
        if (!result.success) {
          toast.error("Session has expired. Login again!", {
            position: "top-center",
          });

          changeUserInformationToLoggedOut();
          navigate(Paths.LOGIN);
          return false;
        }

        changeUserInformationToLoggedIn(
          result.data.accessToken,
          result.data.refreshToken,
          result.data.id
        );
      }
      
      try {
        const response = await getRecommendations(dto);
        if (!response.ok) {
          toast.error("Failed to get recommendations", {
            position: "top-center",
          });
          setIsDataLoading(false);
          return false;
        }
  
        const data = await response.json();
        setRecommendations(data);
        setIsDataLoading(false);
        return true;
      } catch {
        toast.error("Failed to get recommendations", {
          position: "top-center",
        });
        setIsDataLoading(false);
        return false;
      }
  }

  const onNextStep = async () => {
    if (currentStep.label === "Select Location" && (!geometry || !address || address.length === 0)) {
      setAddressError("Please select a location");
      return;
    }

    if (currentStep.label === "Select Filters" && (!categories || categories.length === 0)) {
      setCategoryError("Please select at least one category");
      return;
    }

    setAddressError(null);
    if (currentStep.label === "Select Filters") {
      var success = await tryGettingRecommendations();
      if (!success) {
        return;
      }
    }

    nextStep();
  };

  const onReset = () => {
    onFormReset();
    resetSteps();
  }

  return (
    <>
      {hasCompletedAllSteps && (
        <FinalStepCard recommendations={recommendations}/>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={onReset}>
            Try Again
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
            <CreateEditLoadingButton
              loading={isDataLoading}
              text={isLastStep ? "Get Recommendations" : isOptionalStep ? "Skip" : "Next"}
              size="sm"
              onClick={onNextStep}
            />
          </>
        )}
      </div>
    </>
  );
};
