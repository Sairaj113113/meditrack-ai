import apiClient from './apiClient';

export const addMedicine = async (payload: any) => {
  const response = await apiClient.post(
    '/medicines',
    payload
  );

  return response.data.data;
};

export const updateMedicine = async (id: string, payload: any) => {
  const response = await apiClient.put(`/medicines/${id}`, payload);
  return response.data.data;
};

export const updateSchedule = async (id: string, payload: any) => {
  const response = await apiClient.put(`/medicines/schedules/${id}`, payload);
  return response.data.data;
};

export const getMedicineById = async (id: string) => {
  const response = await apiClient.get(`/medicines/${id}`);
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