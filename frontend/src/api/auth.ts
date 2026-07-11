import { apiFetch } from "./client";

export interface SignupPayload {
  full_name: string;
  business_name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signup = (data: SignupPayload) =>
  apiFetch("/api/auth/signup/", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const login = (data: LoginPayload) =>
  apiFetch("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });