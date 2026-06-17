import apiClient from './apiClient';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ApiResponse> => {
  const response = await apiClient.put(
    '/users/change-password',
    data
  );

  return response.data;
};