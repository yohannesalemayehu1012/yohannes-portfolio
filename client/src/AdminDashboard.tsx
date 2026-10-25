
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, type Project } from "./services/projectService";
import "./AdminDashboard.css";
import { logout } from "./services/authService";

function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function handleLogout() {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to log out.",
      );
    }
  }

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load projects.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter((project) => {
    const query = search.trim().toLowerCase();

    return (
      project.title.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query)
    );
  });

  const featuredCount = projects.filter(
    (project) => project.featured,
  ).length;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark">Y.</span>
          <span>Portfolio<span className="admin-brand-dot">.</span></span>
        </Link>

        <p className="admin-sidebar-label">WORKSPACE</p>

        <nav className="admin-navigation">
          <a href="#overview" className="admin-nav-item active">
            <span>▦</span> Overview
          </a>
          <a href="#projects" className="admin-nav-item">
            <span>▤</span> Projects
          </a>
          <a href="#settings" className="admin-nav-item">
            <span>⚙</span> Settings
          </a>
        </nav>

        <button
          type="button"
          className="admin-logout-button"
          onClick={() => void handleLogout()}
        >
          <span aria-hidden="true">↪</span> Log out
        </button>

        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">YA</span>
          <div>
            <strong>Portfolio Admin</strong>
            <small>Authentication pending</small>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-breadcrumb">WORKSPACE / OVERVIEW</p>
            <h1>Dashboard</h1>
          </div>

          <Link to="/" className="admin-view-site">
            View portfolio <span>↗</span>
          </Link>
        </header>

        <section id="overview" className="admin-welcome">
          <div>
            <p className="admin-eyebrow">YOUR CONTROL CENTER</p>
            <h2>Manage your work.</h2>
            <p>
              Review your portfolio projects and keep track of
              what you've published.
            </p>
          </div>

          <div className="admin-welcome-symbol">{"{ }"}</div>
        </section>

        <section className="admin-stats" aria-label="Project statistics">
          <article className="admin-stat-card">
            <span className="admin-stat-label">Total projects</span>
            <strong>{loading ? "—" : projects.length}</strong>
            <span className="admin-stat-note">Projects in your database</span>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-label">Featured projects</span>
            <strong>{loading ? "—" : featuredCount}</strong>
            <span className="admin-stat-note">Marked as featured</span>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-label">API status</span>
            <strong className="admin-status-value">
              {loading ? "Checking" : error ? "Error" : "Connected"}
            </strong>
            <span className="admin-stat-note">
              {error ? "Check the backend server" : "Project API response"}
            </span>
          </article>
        </section>

        <section id="projects" className="admin-projects-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">CONTENT MANAGEMENT</p>
              <h2>Projects</h2>
              <p>View and search your portfolio projects.</p>
            </div>

            <button
              className="admin-primary-button"
              disabled
              title="Available after admin authentication is implemented"
            >
              + Add project
            </button>
          </div>

          <div className="admin-project-toolbar">
            <label className="admin-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search projects"
              />
            </label>

            <button
              className="admin-secondary-button"
              onClick={() => void loadProjects()}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>

          <div className="admin-table-wrapper">
            {loading ? (
              <p className="admin-message" role="status">
                Loading projects...
              </p>
            ) : error ? (
              <div className="admin-message admin-message-error" role="alert">
                <p>Unable to load projects.</p>
                <p>{error}</p>
                <button
                  className="admin-secondary-button"
                  onClick={() => void loadProjects()}
                >
                  Try again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <p className="admin-message">
                No matching projects found.
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>PROJECT</th>
                    <th>CATEGORY</th>
                    <th>TECHNOLOGIES</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div className="admin-project-name">
                          <span className="admin-project-icon">
                            {"</>"}
                          </span>
                          <div>
                            <strong>{project.title}</strong>
                            <small>
                              ID: {project.id.toString().padStart(3, "0")}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{project.category}</td>
                      <td>
                        <div className="admin-tech-list">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span key={tech}>{tech}</span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span>
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`admin-project-status ${
                            project.featured ? "featured" : "standard"
                          }`}
                        >
                          {project.featured ? "Featured" : "Standard"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            disabled
                            title="Available after admin authentication is implemented"
                            aria-label={`Edit ${project.title}`}
                          >
                            Edit
                          </button>
                          <button
                            disabled
                            title="Available after admin authentication is implemented"
                            aria-label={`Delete ${project.title}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && !error && (
            <p className="admin-table-footer">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          )}
        </section>

        <section id="settings" className="admin-security-notice">
          <span className="admin-security-icon">!</span>
          <div>
            <strong>Admin security setup is the next step</strong>
            <p>
              Project changes are disabled until login and API
              authorization are implemented.
            </p>
          </div>
        </section>

        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} Portfolio Dashboard</span>
          <span>Built with React + TypeScript</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
