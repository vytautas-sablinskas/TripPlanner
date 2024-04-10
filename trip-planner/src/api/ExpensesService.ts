import ENDPOINTS from "./Endpoints";

export const createExpense = async (tripId : any, budgetId : any, values : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.EXPENSES.ADD_EXPENSE.replace(":tripId", tripId).replace(":budgetId", budgetId),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(values),
        });

    return response;
}