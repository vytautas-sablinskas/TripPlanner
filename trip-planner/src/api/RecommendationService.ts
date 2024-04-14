import ENDPOINTS from "./Endpoints";

export const getRecommendations = async (values : any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(ENDPOINTS.RECOMMENDATIONS.GET_RECOMMENDATIONS,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values),
        });

    return response;
}
