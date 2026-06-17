import apiClient from './apiClient';

export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const getNotificationDetails = async (
  id: string
) => {
  const response = await apiClient.get(
    `/notifications/${id}`
  );

  return response.data;
};

export const markNotificationRead = async (
  id: string
) => {
  const response = await apiClient.put(
    `/notifications/read/${id}`
  );

  return response.data;
};

export const markAllNotificationsRead =
  async () => {
    const response = await apiClient.put(
      '/notifications/read-all'
    );

    return response.data;
  };