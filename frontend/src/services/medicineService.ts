import apiClient from './apiClient';

export const addMedicine = async (payload: any) => {
  const response = await apiClient.post(
    '/medicines',
    payload
  );

  return response.data.data;
};

export const getMedicines = async (
  category?: string,
  period?: string
) => {
  const response = await apiClient.get(
    '/medicines',
    {
      params: {
        category,
        period,
      },
    }
  );

  return response.data.data;
};