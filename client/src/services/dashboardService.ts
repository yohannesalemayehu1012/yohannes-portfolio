const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface DashboardStatistics {
  totalProjects: number;
  featuredProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

export interface RecentProject {
  id: number;
  title: string;
  category: string;
  featured: boolean;
}

export interface RecentMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardData {
  statistics: DashboardStatistics;
  recentProjects: RecentProject[];
  recentMessages: RecentMessage[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: DashboardData;
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/api/dashboard/stats`, {
    method: "GET",
    credentials: "include",
  });

  const result = (await response.json()) as ApiResponse;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(
      result.message || `Unable to load dashboard (${response.status})`,
    );
  }

  return result.data;
}