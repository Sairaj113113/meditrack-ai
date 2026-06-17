import apiClient from './apiClient';

export interface UpdateSettingsRequest {
  notificationsEnabled: boolean;
  reminderMode: 'NOTIFICATION' | 'ALARM';
  vibrationEnabled: boolean;
}

export const getSettings = async () => {
  const response = await apiClient.get('/settings');
  return response.data;
};

export const updateSettings = async (
  data: UpdateSettingsRequest
) => {
  const response = await apiClient.put(
    '/settings',
    data
  );

  return response.data;
};