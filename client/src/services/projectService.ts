
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  featured: boolean;
}

export type ProjectInput = Omit<Project, "id">;

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
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

export async function getProjects(): Promise<Project[]> {
  const result = await request<Project[]>("/api/projects");

  if (!Array.isArray(result.data)) {
    throw new Error("The server returned an invalid projects response.");
  }

  return result.data;
}

export async function createProject(
  project: ProjectInput,
): Promise<Project> {
  const result = await request<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

  if (!result.data) {
    throw new Error("The server did not return the created project.");
  }

  return result.data;
}

export async function updateProject(
  id: number,
  project: ProjectInput,
): Promise<Project> {
  const result = await request<Project>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });

  if (!result.data) {
    throw new Error("The server did not return the updated project.");
  }

  return result.data;
}

export async function deleteProject(id: number): Promise<void> {
  await request<never>(`/api/projects/${id}`, {
    method: "DELETE",
  });
}
