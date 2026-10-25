
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
  type ProjectInput,
} from "./services/projectService";
import { logout } from "./services/authService";
import "./AdminDashboard.css";

const emptyForm: ProjectInput = {
  title: "",
  category: "",
  description: "",
  technologies: [],
  githubUrl: "",
  featured: false,
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [technologyText, setTechnologyText] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load projects.";

      setError(message);

      if (message.toLowerCase().includes("authentication")) {
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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

  const featuredCount = projects.filter((project) => project.featured).length;

  function openCreateForm() {
    setEditingProject(null);
    setForm({ ...emptyForm });
    setTechnologyText("");
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
    setForm({
      title: project.title,
      category: project.category,
      description: project.description,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      featured: project.featured,
    });
    setTechnologyText(project.technologies.join(", "));
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingProject(null);
    setForm({ ...emptyForm });
    setTechnologyText("");
  }

  function updateField<K extends keyof ProjectInput>(
    field: K,
    value: ProjectInput[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const technologies = technologyText
      .split(",")
      .map((technology) => technology.trim())
      .filter(Boolean);

    if (technologies.length === 0) {
      setError("Enter at least one technology, separated by commas.");
      return;
    }

    const payload: ProjectInput = {
      ...form,
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      githubUrl: form.githubUrl.trim(),
      technologies,
    };

    setSaving(true);

    try {
      if (editingProject) {
        await updateProject(editingProject.id, payload);
        setNotice("Project updated successfully.");
      } else {
        await createProject(payload);
        setNotice("Project created successfully.");
      }

      setFormOpen(false);
      setEditingProject(null);
      setForm({ ...emptyForm });
      setTechnologyText("");

      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");
    setDeletingId(project.id);

    try {
      await deleteProject(project.id);
      setNotice(`"${project.title}" was deleted.`);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete project.";

      setError(message);

      if (message.toLowerCase().includes("authentication")) {
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log out.");
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark">Y.</span>
          <span>
            Portfolio<span className="admin-brand-dot">.</span>
          </span>
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
            <small>Authenticated session</small>
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
              Create, update, and organize the projects displayed on your
              public portfolio.
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
              {loading ? "Checking" : error ? "Check API" : "Connected"}
            </strong>
            <span className="admin-stat-note">Project API response</span>
          </article>
        </section>

        {notice && (
          <div className="admin-feedback admin-feedback-success" role="status">
            {notice}
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">
              ×
            </button>
          </div>
        )}

        {error && !formOpen && (
          <div className="admin-feedback admin-feedback-error" role="alert">
            {error}
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        <section id="projects" className="admin-projects-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">CONTENT MANAGEMENT</p>
              <h2>Projects</h2>
              <p>Manage the work visitors see on your portfolio.</p>
            </div>

            <button
              type="button"
              className="admin-primary-button"
              onClick={openCreateForm}
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
              type="button"
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
            ) : error && projects.length === 0 ? (
              <div className="admin-message admin-message-error" role="alert">
                <p>Unable to load projects.</p>
                <p>{error}</p>
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => void loadProjects()}
                >
                  Try again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <p className="admin-message">No matching projects found.</p>
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
                          <span className="admin-project-icon">{"</>"}</span>
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
                            <span>+{project.technologies.length - 3}</span>
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
                            type="button"
                            onClick={() => openEditForm(project)}
                            disabled={deletingId !== null}
                            aria-label={`Edit ${project.title}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(project)}
                            disabled={deletingId !== null}
                            aria-label={`Delete ${project.title}`}
                          >
                            {deletingId === project.id ? "Deleting..." : "Delete"}
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

        {formOpen && (
          <div className="admin-modal-backdrop">
            <section
              className="admin-project-form-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-form-title"
            >
              <div className="admin-form-heading">
                <div>
                  <p className="admin-eyebrow">PROJECT MANAGEMENT</p>
                  <h2 id="project-form-title">
                    {editingProject ? "Edit project" : "Add project"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="admin-close-button"
                  onClick={closeForm}
                  disabled={saving}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <form className="admin-project-form" onSubmit={handleSubmit}>
                <label htmlFor="project-title">Project title</label>
                <input
                  id="project-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  minLength={2}
                  maxLength={100}
                  required
                />

                <label htmlFor="project-category">Category</label>
                <input
                  id="project-category"
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  minLength={2}
                  maxLength={60}
                  placeholder="Full-Stack Development"
                  required
                />

                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  minLength={10}
                  maxLength={1000}
                  rows={4}
                  required
                />

                <label htmlFor="project-technologies">
                  Technologies (separate with commas)
                </label>
                <input
                  id="project-technologies"
                  value={technologyText}
                  onChange={(event) => setTechnologyText(event.target.value)}
                  placeholder="React, TypeScript, Express"
                  required
                />

                <label htmlFor="project-github">Project URL</label>
                <input
                  id="project-github"
                  type="url"
                  value={form.githubUrl}
                  onChange={(event) => updateField("githubUrl", event.target.value)}
                  placeholder="https://github.com/your-account/project"
                  maxLength={2048}
                  required
                />

                <label className="admin-featured-checkbox">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateField("featured", event.target.checked)}
                  />
                  Mark this project as featured
                </label>

                {error && (
                  <p className="admin-form-error" role="alert">{error}</p>
                )}

                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingProject
                        ? "Save changes"
                        : "Create project"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        <section id="settings" className="admin-security-notice">
          <span className="admin-security-icon">✓</span>
          <div>
            <strong>Admin authentication enabled</strong>
            <p>
              Project changes are sent to the API with your authentication
              cookie and validated by the backend.
            </p>
          </div>
        </section>

        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} Portfolio Dashboard</span>
          <span>React + TypeScript + SQLite</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
