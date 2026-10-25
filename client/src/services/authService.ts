
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface AdminUser {
  email: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: AdminUser;
}

async function readResponse(response: Response): Promise<AuthResponse> {
  return response.json() as Promise<AuthResponse>;
}

export async function login(
  email: string,
  password: string,
): Promise<AdminUser> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const result = await readResponse(response);

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Login failed.");
  }

  return result.data;
}

export async function getCurrentAdmin(): Promise<AdminUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: "include",
  });

  const result = await readResponse(response);

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.message || "Not authenticated.");
  }

  return result.data;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await readResponse(response);

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Logout failed.");
  }
}
