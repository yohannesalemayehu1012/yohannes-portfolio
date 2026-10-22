
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  featured: boolean;
}

interface ProjectsResponse {
  success: boolean;
  count: number;
  data: Project[];
}

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/api/projects`);

  if (!response.ok) {
    throw new Error(`Failed to load projects (${response.status})`);
  }

  const result: ProjectsResponse = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("The server returned an invalid project response.");
  }

  return result.data;
}
