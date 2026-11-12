import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjects, type Project } from "./services/projectService";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const projectId = Number(id);

        if (!Number.isSafeInteger(projectId) || projectId <= 0) {
          throw new Error("Invalid project ID.");
        }

        const projects = await getProjects();

        const selectedProject = projects.find(
          (item) => item.id === projectId
        );

        if (active) {
          setProject(selectedProject ?? null);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this project."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <main className="project-details-page">
      <div className="project-details-container">
        <Link to="/#projects" className="back-to-projects">
          ← Back to projects
        </Link>

        {loading ? (
          <p className="project-details-status" role="status">
            Loading project...
          </p>
        ) : error ? (
          <div className="project-details-status project-details-error" role="alert">
            <h2>Unable to load project</h2>
            <p>{error}</p>
          </div>
        ) : !project ? (
          <div className="project-details-status">
            <h2>Project not found</h2>
            <p>
              This project may have been removed or the address may be incorrect.
            </p>
            <Link to="/#projects" className="details-button">
              Explore other projects
            </Link>
          </div>
        ) : (
          <article className="project-details-content">
            <p className="project-details-eyebrow">
              PROJECT / {project.category}
            </p>

            <h1>{project.title}</h1>

            {project.featured && (
              <span className="featured-label">Featured Project</span>
            )}

            <div className="project-details-divider" />

            <section className="details-section">
              <h2>About this project</h2>
              <p>{project.description}</p>
            </section>

            <section className="details-section">
              <h2>Technologies used</h2>

              <div className="details-technologies">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </section>

            <div className="project-details-actions">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="details-button"
                >
                  View source code ↗
                </a>
              )}

              <Link to="/#projects" className="details-secondary-button">
                Back to all projects
              </Link>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

export default ProjectDetails;