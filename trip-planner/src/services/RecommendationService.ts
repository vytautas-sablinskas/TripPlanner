import ENDPOINTS from "./Endpoints";

export const getRecommendations = async (values: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(ENDPOINTS.RECOMMENDATIONS.GET_RECOMMENDATIONS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  return response;
};

export const getRecommendationWeights = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.RECOMMENDATIONS.GET_RECOMMENDATION_WEIGHTS,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const editRecommendationWeights = async (values: any) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(
    ENDPOINTS.RECOMMENDATIONS.EDIT_RECOMMENDATION_WEIGHTS,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }
  );

  return response;
};
