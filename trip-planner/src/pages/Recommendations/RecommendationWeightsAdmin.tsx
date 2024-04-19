import { refreshAccessToken } from "@/api/AuthenticationService";
import { editRecommendationWeights, getRecommendationWeights } from "@/api/RecommendationService";
import { useUser } from "@/providers/user-provider/UserContext";
import Paths from "@/routes/Paths";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DEFAULT_WEIGHTS } from "./RecommendationWeights";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RecommendationWeightsAdmin = () => {
  const navigate = useNavigate();
  const {
    changeUserInformationToLoggedIn,
    changeUserInformationToLoggedOut,
    isAuthenticated,
    role,
  } = useUser();
  const [weights, setWeights] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(true);
  const [errors, setErrors] = useState<any>([]);
  let priceErrorCount = 0;
  let otherWeightErrorCount = 0;

  const onSubmit = async () => {
    const priceWeight = weights.find((weight: any) => weight.name === "Price");
    if (!priceWeight || priceWeight.value <= 0 || priceWeight.value > 20) {
        priceErrorCount += 1;
        const existingError = errors.find((error: any) => error.name === "Price");
        if (existingError) {
            setErrors((prevErrors: any) => prevErrors.map((error: any) => {
                if (error.name === "Price") {
                    return { ...error, error: "Price Rate should be between 0 and 20" };
                }
                return error;
            }));
        } else {
            priceErrorCount += 1;
            setErrors((prevErrors: any) => [
                ...prevErrors,
                { name: "Price", error: "Price Rate should be between 0 and 20" }
            ]);
        }
    }
    else {
        priceErrorCount -= 1;
        setErrors((prevErrors: any) => prevErrors.filter((error: any) => error.name !== "Price"));
    }

    const otherWeights = weights.filter((weight: any) => weight.name !== "Price");
    otherWeights.forEach((weight: any) => {
        if (weight.value < 0 || weight.value > 100) {
            const existingError = errors.find((error: any) => error.name === weight.name);
            if (existingError) {
                otherWeightErrorCount += 1;
                setErrors((prevErrors: any) => prevErrors.map((error: any) => {
                    if (error.name === weight.name) {
                        return { ...error, error: `${weight.name} should be between 0 and 100` };
                    }
                    return error;
                }));
            } else {
                otherWeightErrorCount += 1;
                setErrors((prevErrors: any) => [
                    ...prevErrors,
                    { name: weight.name, error: `${weight.name} should be between 0 and 100` }
                ]);
            }
        }
        else {
            otherWeightErrorCount -= 1;
            setErrors((prevErrors: any) => prevErrors.filter((error: any) => error.name !== weight.name));
        }
    });

    if (otherWeightErrorCount > 0 || priceErrorCount > 0) {
        return;
    }

    const response = await editRecommendationWeights({ recommendationWeights: weights });
    if (!response.ok) {
        toast.error("Failed to save recommendation weights. Try again.", {
            position: "top-center",
        });
        return;
    }

    toast.success("Recommendation weights saved successfully!", {
        position: "top-center",
    });
  };

  useEffect(() => {
    const tryFetchingRecommendations = async () => {
      setIsLoading(true);
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

      const response = await getRecommendationWeights();
      if (!response.ok) {
        toast.error(
          "Failed to get recommendation weights. Try refreshing page.",
          {
            position: "top-center",
          }
        );
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setWeights(data);
      setIsLoading(false);
    };

    if (!isAuthenticated) {
      navigate(Paths.LOGIN);
      return;
    }

    if (Array.isArray(role)) {
        if (!role.includes("Admin")) {
            navigate(Paths.HOME);
            return;
        }
    } else {
        if (role !== "Admin") {
            navigate(Paths.HOME);
            return;
        }
    }

    tryFetchingRecommendations();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleWeightChange = (name: string, value: any) => {
    setWeights((prevWeights: any) => {
        const updatedWeights = prevWeights.map((weight: any) => {
            if (weight.name === name) {
                return { ...weight, value: Number(value)};
            }
            return weight;
        });
        return updatedWeights;
    });
  };

  function splitWordsByUpperCase(word : any) {
    return word.split(/(?=[A-Z])/).join(' ');
  }

  return (
    <div className="w-full flex flex-wrap justify-center">
      <div className="w-2/4">
        <div className="flex flex-col gap-3 my-4">
          <p className="text-2xl font-bold">Rating Weights</p>
          {DEFAULT_WEIGHTS.slice(0, 3).map((defaultWeight, index) => {
            const weight = weights.find(
              (w: any) => w.name === defaultWeight.Name
            );
            if (weight) {
              const errorMessage = errors.find((error: any) => error.name === weight.name)?.error;

              return (
                <div key={index} className="flex flex-col flex-1">
                    <Label>{splitWordsByUpperCase(weight.name)} (0 - 100)</Label>
                    <Input type="number" className="mt-1" value={weight.value} placeholder={`Select ${splitWordsByUpperCase(weight.name)}`} min={0} max={100} onChange={(e) => handleWeightChange(weight.name, e.target.value)}/>
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{splitWordsByUpperCase(errorMessage)}</p>}
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="flex flex-col gap-3 my-4">
          <p className="text-2xl font-bold">Rating Count Weights</p>
          {DEFAULT_WEIGHTS.slice(3, 6).map((defaultWeight, index) => {
            const weight = weights.find(
              (w: any) => w.name === defaultWeight.Name
            );
            if (weight) {
              const errorMessage = errors.find((error: any) => error.name === weight.name)?.error;

              return (
                <div key={index} className="flex flex-col flex-1">
                    <Label>{splitWordsByUpperCase(weight.name)} (0 - 100)</Label>
                    <Input type="number" className="mt-1" value={weight.value} placeholder={`Select ${splitWordsByUpperCase(weight.name)}`} min={0} max={100} onChange={(e) => handleWeightChange(weight.name, e.target.value)}/>
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{splitWordsByUpperCase(errorMessage)}</p>}
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="flex flex-col gap-3 my-4">
          <p className="text-2xl font-bold">Distance Weights</p>
          {DEFAULT_WEIGHTS.slice(6, 9).map((defaultWeight, index) => {
            const weight = weights.find(
              (w: any) => w.name === defaultWeight.Name
            );
            if (weight) {
              const errorMessage = errors.find((error: any) => error.name === weight.name)?.error;

              return (
                <div key={index} className="flex flex-col flex-1">
                    <Label>{splitWordsByUpperCase(weight.name)} (0 - 100)</Label>
                    <Input type="number" className="mt-1" value={weight.value} placeholder={`Select ${splitWordsByUpperCase(weight.name)}`} min={0} max={100} onChange={(e) => handleWeightChange(weight.name, e.target.value)}/>
                    {errorMessage && <p className="text-red-500 text-sm mt-1">{splitWordsByUpperCase(errorMessage)}</p>}
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="flex flex-col gap-2 my-4">
          <p className="text-2xl font-bold mt-4 mb-1">Price Weight</p>
          {DEFAULT_WEIGHTS.slice(9).map((defaultWeight, index) => {
            const weight = weights.find(
              (w: any) => w.name === defaultWeight.Name
            );
            if (weight) {
              const errorMessage = errors.find((error: any) => error.name === weight.name)?.error;

              return (
                <div key={index} className="flex flex-col">
                  <Label>{splitWordsByUpperCase(weight.name)} {weight.name === "Price" ? "(0 - 20)" : "(0 - 100)"}</Label>
                  <Input type="number" className="mt-1" value={weight.value} placeholder="Select Price Rate" min={0} max={weight.name === "Price" ? 20 : 100} onChange={(e) => handleWeightChange(weight.name, e.target.value)}/>
                  {errorMessage && <p className="text-red-500 text-sm mt-1">{splitWordsByUpperCase(errorMessage)}</p>}
                </div>
              );
            }
            return null;
          })}
        </div>
        <Button className="mt-2" type="submit" onClick={() => onSubmit()}>
            Save
        </Button>
      </div>
    </div>
  );
};

export default RecommendationWeightsAdmin;
