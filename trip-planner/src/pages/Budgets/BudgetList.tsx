import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Paths from "@/routes/Paths";
import { useNavigate } from "react-router-dom";
import "./styles/BudgetList.css";
import { CirclePlus } from "lucide-react";
import BudgetCard from "./BudgetCard";
import { useEffect, useState } from "react";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { getTripBudgets } from "@/api/TriBudgetsService";

const BudgetList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { changeUserInformationToLoggedOut, changeUserInformationToLoggedIn } =
    useUser();
  const [budgets, setBudgets] = useState([]);

  const getTripId = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 2];
  };

  useEffect(() => {
    const fetchBudgets = async () => {
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
          return;
        }

        changeUserInformationToLoggedIn(
          result.data.accessToken,
          result.data.refreshToken
        );
      }

      const response = await getTripBudgets(getTripId());
      if (!response.ok) {
        toast.error("Unexpected error. Try refreshing page", {
          position: "top-center",
        });
        return;
      }

      const data = await response.json();
      setBudgets(data);
      setIsLoading(false);
    };

    fetchBudgets();
  }, []);

  return (
    <div className="main-budget-list-container">
      <div className="flex justify-end">
        <Button
          className="rounded-xl"
          variant="ghost"
          onClick={() =>
            navigate(Paths.CREATE_BUDGET.replace(":tripId", getTripId()))
          }
        >
          <CirclePlus className="mr-2" />
          Add New Budget
        </Button>
      </div>
      <Separator className="mt-2" />
      <div className="budget-card-container-wrapper">
        {budgets.map((budget: any) => {
          return <BudgetCard key={budget.id} budget={budget} setData={setBudgets}/>;
        })}
      </div>
    </div>
  );
};

export default BudgetList;
