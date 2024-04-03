import { Button } from "@/components/ui/button";
import Paths from "@/routes/Paths";
import { useNavigate } from "react-router-dom"

const BudgetList = () => {
    const navigate = useNavigate();

    const getTripId = () => {
        const paths = location.pathname.split("/");
        return paths[paths.length - 2];
    }

    return (
        <Button onClick={() => navigate(Paths.CREATE_BUDGET.replace(":tripId", getTripId()))}>
            Add new budget
        </Button>
    )
}

export default BudgetList;