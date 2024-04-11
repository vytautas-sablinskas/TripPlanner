import { Card, CardContent } from "@/components/ui/card";
import "./styles/BudgetCard.css";
import { Button } from "@/components/ui/button";
import { CircleX, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import DeleteDialog from "@/components/Extra/DeleteDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "@/routes/Paths";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { refreshAccessToken } from "@/api/AuthenticationService";
import { toast } from "sonner";
import { useUser } from "@/providers/user-provider/UserContext";
import { deleteTripBudget } from "@/api/TriBudgetsService";

const BudgetCard = ({ budget, setData } : any) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { changeUserInformationToLoggedOut, changeUserInformationToLoggedIn } = useUser();

    const getTypeName = () => {
        if (budget.type === 0) return "Individual Budget";
        if (budget.type === 1) return "Shared Budget";
        if (budget.type === 2) return "Individual With Fixed Budget";
    }

    const getSpentAmountPercentage = () => {
        const percentage = (budget.spentAmount / budget.amount) * 100;
        return percentage > 100 ? 100 : percentage;
    }

    const getTripId = () => {
        const paths = location.pathname.split("/");
        return paths[paths.length - 2];
    }

    const handleDelete = async () => {
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

            const response = await deleteTripBudget(getTripId(), budget.id);
            if (!response.ok) {
                toast.error("Unexpected error. Try refreshing page", {
                    position: "top-center",
                });
                setIsLoading(false);
                setIsDeleteDialogOpen(false);
                return;
            }

            setData((prevData : any) => {
                return prevData.filter((b : any) => b.id !== budget.id);
            });
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            toast.success("Budget deleted successfully", {
                position: "top-center",
            });
    }
    
    return (
        <Card className="budget-card">
            <CardContent className="budget-card-content">
                <div className="flex flex-col">
                    <p className="text-2xl font-lg">{budget.name}</p>
                    <p className="mt-2 text-lg">{getTypeName()}</p>
                    {budget.description && (<p className="mt-2 description-text">{budget.description}</p>)}

                    <p className="mt-4 text-lg">
                        {budget.unlimitedBudget ? (
                            <>
                                <p>Budget is unlimited.</p>
                                <span>{budget.spentAmount.toFixed(2)} {budget.mainCurrency} Spent. </span>
                                <Progress value={0} className="w-full mt-1"/>
                            </>
                        ) : (
                            <>
                                <span>{budget.spentAmount.toFixed(2)} / {budget.amount.toFixed(2)} {budget.mainCurrency} Spent</span>
                                <Progress value={getSpentAmountPercentage()} className="w-full mt-1"/>
                            </>
                        )}
                    </p>
                </div>
                <div className="mt-2">
                    <Button className="mr-6 pl-0 justify-start" variant="ghost" onClick={() => navigate(Paths.EDIT_BUDGET.replace(":tripId", getTripId()).replace(":budgetId", budget.id))}>
                        <Pencil className="mr-2"/>
                        Edit
                    </Button>
                    <Button variant="ghost" className="pl-0 justify-start" onClick={() => setIsDeleteDialogOpen(true)}>
                        <CircleX className="mr-2"/>
                        Delete
                    </Button>
                </div>
                <DeleteDialog 
                    open={isDeleteDialogOpen}
                    setOpen={setIsDeleteDialogOpen}
                    title="Delete Budget"
                    description="Are you sure you want to delete this budget? This will permanently delete this budget and all expenses. Other assigned members will not be able to see it anymore."
                    dialogButtonText="Delete Budget"
                    onDelete={() => handleDelete()}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}

export default BudgetCard;
