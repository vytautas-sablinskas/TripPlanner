import ENDPOINTS from "./Endpoints";

export const getTripTravellersForBudget = async (tripId : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_BUDGETS.GET_TRAVELLERS_MINIMAL_INFO.replace(":tripId", tripId),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}

export const getTripBudgets = async (tripId : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_BUDGETS.GET_BUDGETS.replace(":tripId", tripId),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}

export const addTripBudget = async (tripId : any,  values : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_BUDGETS.ADD_BUDGET.replace(":tripId", tripId),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values)
        });

    return response;
}

export const deleteTripBudget = async (tripId : any,  budgetId : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.TRIP_BUDGETS.DELETE_BUDGET.replace(":tripId", tripId).replace(":budgetId", budgetId),
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

    return response;
}