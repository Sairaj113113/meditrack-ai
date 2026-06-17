import apiClient from './apiClient';

export const getMedicalProfile = async () => {
  const response = await apiClient.get(
    '/users/medical-profile'
  );

  return response.data.data;
};