import { Button } from "@/components/ui/button";
import Paths from "@/routes/Paths";
import { useNavigate } from "react-router-dom"

const BudgetList = () => {
    const navigate = useNavigate();

    return (
        <Button onClick={() => navigate(Paths.CREATE_BUDGET)}>
            Add new budget
        </Button>
    )
}

export default BudgetList;