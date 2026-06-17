import apiClient from './apiClient';

export const getDashboard = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data.data;
};

export const getAdherenceCalendar = async (year?: number, month?: number) => {
  const params = year && month ? `?year=${year}&month=${month}` : '';
  const response = await apiClient.get(`/adherence/calendar${params}`);
  return response.data.data;
};