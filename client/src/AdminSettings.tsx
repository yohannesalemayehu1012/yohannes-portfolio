import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./services/authService";
import {
  getPortfolioSettings,
  updatePortfolioSettings,
  type PortfolioSettings,
} from "./services/settingsService";
import "./AdminSettings.css";

const emptySettings: PortfolioSettings = {
  name: "",
  role: "",
  headline: "",
  introduction: "",
  about: "",
  email: "",
  location: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
};

function AdminSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState<PortfolioSettings>(emptySettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const data = await getPortfolioSettings();

        if (active) {
          setSettings(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load portfolio settings.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(
    field: keyof PortfolioSettings,
    value: string,
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const updated = await updatePortfolioSettings(settings);
      setSettings(updated);
      setNotice("Portfolio settings saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/admin/login");
    } catch {
      setError("Unable to log out. Please try again.");
    }
  }

  if (loading) {
    return <main className="settings-page">Loading settings...</main>;
  }

  return (
    <main className="settings-page">
      <div className="settings-container">
        <header className="settings-header">
          <div>
            <p className="settings-eyebrow">ADMINISTRATION</p>
            <h1>Portfolio Settings</h1>
            <p>Manage the information displayed on your public portfolio.</p>
          </div>

          <button
            type="button"
            className="settings-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </header>

        <nav className="settings-navigation" aria-label="Admin navigation">
          <Link to="/admin">Projects</Link>
          <Link to="/admin/messages">Messages</Link>
          <Link to="/admin/settings" aria-current="page">
            Settings
          </Link>
          <Link to="/" target="_blank">
            View portfolio ↗
          </Link>
        </nav>

        {error && (
          <p className="settings-error" role="alert">
            {error}
          </p>
        )}

        {notice && (
          <p className="settings-success" role="status">
            {notice}
          </p>
        )}

        <form className="settings-form" onSubmit={handleSubmit}>
          <section className="settings-section">
            <h2>Personal information</h2>
            <p>Basic information about you and your professional role.</p>

            <div className="settings-grid">
              <label>
                Full name
                <input
                  value={settings.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  maxLength={100}
                />
              </label>

              <label>
                Professional role
                <input
                  value={settings.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  required
                  maxLength={120}
                />
              </label>

              <label>
                Contact email
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  maxLength={254}
                />
              </label>

              <label>
                Location
                <input
                  value={settings.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  maxLength={120}
                />
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h2>Homepage introduction</h2>
            <p>Control the main message visitors see when they open your website.</p>

            <label>
              Main headline
              <input
                value={settings.headline}
                onChange={(e) => handleChange("headline", e.target.value)}
                required
                maxLength={200}
              />
            </label>

            <label>
              Introduction
              <textarea
                rows={4}
                value={settings.introduction}
                onChange={(e) => handleChange("introduction", e.target.value)}
                required
                maxLength={1000}
              />
            </label>

            <label>
              About me
              <textarea
                rows={6}
                value={settings.about}
                onChange={(e) => handleChange("about", e.target.value)}
                required
                maxLength={2000}
              />
            </label>
          </section>

          <section className="settings-section">
            <h2>Professional links</h2>
            <p>Manage your resume and professional social profiles.</p>

            <label>
              Resume URL or local path
              <input
                value={settings.resumeUrl}
                onChange={(e) => handleChange("resumeUrl", e.target.value)}
                placeholder="/resume.pdf"
                maxLength={500}
              />
            </label>

            <label>
              GitHub profile URL
              <input
                type="url"
                value={settings.githubUrl}
                onChange={(e) => handleChange("githubUrl", e.target.value)}
                placeholder="https://github.com/username"
                maxLength={500}
              />
            </label>

            <label>
              LinkedIn profile URL
              <input
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                maxLength={500}
              />
            </label>
          </section>

          <div className="settings-submit">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Portfolio Settings"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AdminSettings;