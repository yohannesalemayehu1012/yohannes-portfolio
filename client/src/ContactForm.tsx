
import { useState, type FormEvent } from "react";
import "./ContactForm.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

type Feedback = {
  type: "success" | "error";
  text: string;
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setSending(true);

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, website }),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send your message.");
      }

      setFeedback({
        type: "success",
        text: result.message || "Your message has been sent successfully.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setWebsite("");
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="contact-panel" id="contact">
      <div className="contact-copy">
        <p className="section-eyebrow">GET IN TOUCH</p>
        <h2>Have an idea? Let’s build it.</h2>
        <p>
          Have a project, internship opportunity, or collaboration in mind?
          Send me a message.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-field-row">
          <label>
            Name
            <input
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={80}
              required
              placeholder="Your name"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label>
          Subject
          <input
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            minLength={3}
            maxLength={120}
            required
            placeholder="What would you like to discuss?"
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={10}
            maxLength={5000}
            rows={5}
            required
            placeholder="Tell me a little about your idea..."
          />
        </label>

        {/* Honeypot: hidden from ordinary visitors and assistive technology. */}
        <div className="contact-honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </label>
        </div>

        {feedback && (
          <p
            className={`contact-feedback contact-feedback-${feedback.type}`}
            role="status"
            aria-live="polite"
          >
            {feedback.text}
          </p>
        )}

        <button className="contact-submit" type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send message"}
        </button>
      </form>
    </section>
  );
}
