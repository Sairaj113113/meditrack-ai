// src/services/caregiverService.ts

import apiClient from './apiClient';

export const getCaregivers = async () => {
  const response = await apiClient.get('/caregivers');
  return response.data.data;
};

export const addCaregiver = async (data: any) => {
  const response = await apiClient.post(
    '/caregivers',
    data
  );

  return response.data.data;
};

export const updateCaregiver = async (
  id: string,
  data: any
) => {
  const response = await apiClient.put(
    `/caregivers/${id}`,
    data
  );

  return response.data.data;
};

export const setPrimaryCaregiver = async (
  id: string
) => {
  return apiClient.put(
    `/caregivers/set-primary/${id}`
  );
};

export const deleteCaregiver = async (
  id: string
) => {
  return apiClient.delete(
    `/caregivers/${id}`
  );
};