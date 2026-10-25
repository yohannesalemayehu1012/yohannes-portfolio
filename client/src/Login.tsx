
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log in.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <Link to="/" className="login-brand">
          <span className="login-brand-mark">Y.</span>
          <span>Portfolio<span className="login-brand-dot">.</span></span>
        </Link>

        <p className="login-eyebrow">ADMINISTRATION</p>
        <h1>Welcome back.</h1>
        <p className="login-description">
          Sign in to manage your portfolio projects.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            maxLength={128}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-back">
          <Link to="/">← Back to portfolio</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
