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

export const editExpense = async (tripId : any, budgetId : any, expenseId : any, values : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.EXPENSES.EDIT_EXPENSE.replace(":tripId", tripId).replace(":budgetId", budgetId).replace(":expenseId", expenseId),
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(values),
        });

    return response;
}

export const deleteExpense = async (tripId : any, budgetId : any, expenseId : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.EXPENSES.DELETE_EXPENSE.replace(":tripId", tripId).replace(":budgetId", budgetId).replace(":expenseId", expenseId),
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

    return response;
}