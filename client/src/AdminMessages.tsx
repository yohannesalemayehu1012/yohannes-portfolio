
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "./services/authService";
import "./AdminMessages.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

async function apiRequest<T>(
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

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest<Message[]>("/api/messages");
      setMessages(result.data ?? []);
    } catch (err) {
      const text =
        err instanceof Error ? err.message : "Could not load messages.";

      setError(text);

      if (/authentication|session|unauthorized|expired/i.test(text)) {
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function toggleRead(message: Message) {
    setBusyId(message.id);
    setError("");
    setNotice("");

    try {
      const nextReadState = !message.isRead;

      await apiRequest(`/api/messages/${message.id}/read`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: nextReadState }),
      });

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, isRead: nextReadState }
            : item,
        ),
      );

      if (selectedMessage?.id === message.id) {
        setSelectedMessage({ ...message, isRead: nextReadState });
      }

      setNotice(nextReadState ? "Message marked as read." : "Message marked as unread.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update message.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMessage(message: Message) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name}? This cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(message.id);
    setError("");
    setNotice("");

    try {
      await apiRequest(`/api/messages/${message.id}`, {
        method: "DELETE",
      });

      setMessages((current) =>
        current.filter((item) => item.id !== message.id),
      );

      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }

      setNotice("Message deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete message.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  }

  const unreadCount = messages.filter((message) => !message.isRead).length;

  return (
    <div className="messages-admin">
      <aside className="messages-sidebar">
        <Link className="messages-brand" to="/admin">
          <span className="messages-brand-mark">Y.</span>
          <span>Portfolio Admin</span>
        </Link>

        <p className="messages-nav-label">WORKSPACE</p>
        <Link className="messages-nav-link" to="/admin">
          Overview
        </Link>
        <Link className="messages-nav-link messages-nav-active" to="/admin/messages">
          Messages <span>{unreadCount}</span>
        </Link>

        <div className="messages-sidebar-bottom">
          <Link to="/">View portfolio ↗</Link>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="messages-main">
        <header className="messages-header">
          <div>
            <p className="messages-eyebrow">COMMUNICATION</p>
            <h1>Contact messages</h1>
            <p>Review messages submitted through your public portfolio.</p>
          </div>

          <button
            className="messages-refresh"
            type="button"
            onClick={() => void loadMessages()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        <div className="messages-summary">
          <div>
            <span>Total messages</span>
            <strong>{messages.length}</strong>
          </div>
          <div>
            <span>Unread messages</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        {notice && <p className="messages-notice">{notice}</p>}
        {error && <p className="messages-error">{error}</p>}

        {loading ? (
          <p className="messages-empty">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="messages-empty">
            <h2>No messages yet</h2>
            <p>Messages sent through your contact form will appear here.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <article
                className={`message-card ${message.isRead ? "" : "message-card-unread"}`}
                key={message.id}
              >
                <div className="message-card-top">
                  <div className="message-sender">
                    <span className="message-avatar">
                      {message.name.trim().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h2>{message.name}</h2>
                      <a href={`mailto:${message.email}`}>{message.email}</a>
                    </div>
                  </div>

                  <span className={`message-status ${message.isRead ? "" : "message-status-unread"}`}>
                    {message.isRead ? "Read" : "Unread"}
                  </span>
                </div>

                <h3>{message.subject}</h3>
                <p className="message-preview">{message.message}</p>
                <p className="message-date">
                  Received: {message.createdAt}
                </p>

                <div className="message-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(message)}
                  >
                    Read message
                  </button>

                  <button
                    type="button"
                    onClick={() => void toggleRead(message)}
                    disabled={busyId === message.id}
                  >
                    Mark as {message.isRead ? "unread" : "read"}
                  </button>

                  <button
                    className="message-delete"
                    type="button"
                    onClick={() => void deleteMessage(message)}
                    disabled={busyId === message.id}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {selectedMessage && (
        <div
          className="message-modal-backdrop"
          onClick={() => setSelectedMessage(null)}
        >
          <section
            className="message-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="message-modal-header">
              <div>
                <p className="messages-eyebrow">MESSAGE DETAILS</p>
                <h2 id="message-modal-title">{selectedMessage.subject}</h2>
              </div>
              <button
                type="button"
                aria-label="Close message"
                onClick={() => setSelectedMessage(null)}
              >
                ×
              </button>
            </div>

            <p>
              <strong>From:</strong> {selectedMessage.name}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${selectedMessage.email}`}>
                {selectedMessage.email}
              </a>
            </p>
            <p>
              <strong>Received:</strong> {selectedMessage.createdAt}
            </p>

            <div className="message-full-text">{selectedMessage.message}</div>

            <div className="message-modal-actions">
              <a href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}>
                Reply by email
              </a>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
