const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface PortfolioSettings {
  name: string;
  role: string;
  headline: string;
  introduction: string;
  about: string;
  email: string;
  location: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }

  return result;
}

export async function getPortfolioSettings(): Promise<PortfolioSettings> {
  const result = await request<PortfolioSettings>("/api/settings");

  if (!result.data) {
    throw new Error("Portfolio settings were not returned.");
  }

  return result.data;
}

export async function updatePortfolioSettings(
  settings: PortfolioSettings,
): Promise<PortfolioSettings> {
  const result = await request<PortfolioSettings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });

  if (!result.data) {
    throw new Error("Updated settings were not returned.");
  }

  return result.data;
}