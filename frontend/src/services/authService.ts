// src/services/authService.ts

import apiClient from './apiClient';

export interface LoginRequest {
  username: string; // email OR mobile
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  username: string; // email OR mobile
}

export interface ResetPasswordRequest {
  username: string;
  otp: string;
  newPassword: string;
}

class AuthService {
  // REGISTER
 // REGISTER
async register(data: RegisterRequest) {
  try {
    const response = await apiClient.post(
      '/auth/register',
      data
    );

    console.log(
      'REGISTER SUCCESS =>',
      JSON.stringify(response.data, null, 2)
    );

    return response.data;
  } catch (error: any) {
    console.log(
      'REGISTER STATUS =>',
      error?.response?.status
    );

    console.log(
      'REGISTER ERROR DATA =>',
      JSON.stringify(
        error?.response?.data,
        null,
        2
      )
    );

    throw error;
  }
}

  // VERIFY OTP
  async verifyOtp(data: VerifyOtpRequest) {
    const response = await apiClient.post(
      '/auth/verify-otp',
      data
    );

    return response.data;
  }

  // LOGIN
  async login(data: LoginRequest) {
    const response = await apiClient.post(
      '/auth/login',
      data
    );

    return response.data;
  }

  // FORGOT PASSWORD
  async forgotPassword(
    data: ForgotPasswordRequest
  ) {
    const response = await apiClient.post(
      '/auth/forgot-password',
      data
    );

    return response.data;
  }

  // RESET PASSWORD
  async resetPassword(
    data: ResetPasswordRequest
  ) {
    const response = await apiClient.post(
      '/auth/reset-password',
      data
    );

    return response.data;
  }

  // REFRESH TOKEN
  async refreshToken(refreshToken: string) {
    const response = await apiClient.post(
      '/auth/refresh-token',
      {
        refreshToken,
      }
    );

    return response.data;
  }

  // LOGOUT
  async logout(refreshToken: string) {
    const response = await apiClient.post(
      '/auth/logout',
      {
        refreshToken,
      }
    );

    return response.data;
  }
}

export default new AuthService();