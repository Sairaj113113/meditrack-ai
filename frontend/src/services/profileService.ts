import apiClient from './apiClient';

export const getUserProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data.data;
};

export const getMedicalProfile = async () => {
  const response = await apiClient.get('/users/medical-profile');
  return response.data.data;
};