
import { useState } from "react";
import "./App.css";

const projects = [
  {
    number: "01",
    title: "Disease Prediction System",
    category: "MACHINE LEARNING",
    description:
      "A machine learning application that analyzes medical data to predict potential health risks.",
    technologies: ["Python", "Scikit-learn", "FastAPI"],
    link: "https://github.com/",
  },
  {
    number: "02",
    title: "School Management System",
    category: "FULL-STACK DEVELOPMENT",
    description:
      "A web application for managing students, teachers, academic records, and school activities.",
    technologies: ["ASP.NET Core", "C#", "SQL"],
    link: "https://github.com/",
  },
  {
    number: "03",
    title: "House Price Prediction",
    category: "DATA SCIENCE",
    description:
      "A regression model that estimates house prices using property features and historical data.",
    technologies: ["Python", "Pandas", "Flask"],
    link: "https://github.com/",
  },
];

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "HTML & CSS",
  "Node.js",
  "Express",
  "Python",
  "Machine Learning",
  "SQL",
  "Git & GitHub",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="header">
        <nav className="navbar container">
          <a className="logo" href="#home" onClick={closeMenu}>
            YA<span>.</span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#skills" onClick={closeMenu}>Skills</a>
            <a href="#projects" onClick={closeMenu}>Projects</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a
              className="nav-cta"
              href="mailto:hello@example.com"
              onClick={closeMenu}
            >
              Let's Talk <span>↗</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero container" id="home">
          <div className="hero-content">
            <div className="availability">
              <span className="status-dot" />
              SOFTWARE ENGINEERING STUDENT
            </div>

            <p className="eyebrow">HELLO, I'M</p>

            <h1>
              Yohannes
              <br />
              <span>Alemayehu.</span>
            </h1>

            <h2>
              I build digital experiences
              <br />
              <span>for the real world.</span>
            </h2>

            <p className="hero-description">
              I'm a software engineering student passionate about full-stack
              development, machine learning, and creating useful digital
              products through clean and thoughtful code.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                Explore My Work <span>↗</span>
              </a>
              <a className="button button-secondary" href="#contact">
                Get In Touch
              </a>
            </div>

            <div className="hero-meta">
              <span><span className="meta-symbol">⌘</span> Software Engineering</span>
              <span><span className="meta-symbol">◎</span> Always Learning</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Decorative code illustration">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="code-card">
              <div className="code-card-header">
                <div className="window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span>developer.ts</span>
                <span className="code-menu">•••</span>
              </div>

              <div className="code-content">
                <p><span className="line-number">01</span> <span className="code-purple">const</span> developer = {"{"}</p>
                <p><span className="line-number">02</span> &nbsp; name: <span className="code-green">"Yohannes"</span>,</p>
                <p><span className="line-number">03</span> &nbsp; role: <span className="code-green">"Developer"</span>,</p>
                <p><span className="line-number">04</span> &nbsp; passion: <span className="code-green">"Building"</span>,</p>
                <p><span className="line-number">05</span> &nbsp; learning: <span className="code-blue">true</span>,</p>
                <p><span className="line-number">06</span> {"};"}</p>
                <p className="code-comment">// Turning ideas into reality.</p>
              </div>

              <div className="code-card-footer">
                <span><span className="status-dot" /> Ready to build</span>
                <span>TypeScript</span>
              </div>
            </div>

            <div className="floating-card floating-top">
              <span className="floating-icon">{"</>"}</span>
              <div>
                <strong>Clean Code</strong>
                <small>Built with purpose</small>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <span className="floating-icon purple-icon">✳</span>
              <div>
                <strong>Creative Thinking</strong>
                <small>Ideas into solutions</small>
              </div>
            </div>

            <div className="visual-label">DESIGN · DEVELOP · DELIVER</div>
          </div>

          <a className="scroll-indicator" href="#about">
            <span className="scroll-line" />
            SCROLL TO EXPLORE
          </a>
        </section>

        <section className="about section container" id="about">
          <div className="section-heading">
            <p className="eyebrow">01 / ABOUT ME</p>
            <h2>
              Curious mind.
              <br />
              <span>Builder at heart.</span>
            </h2>
          </div>

          <div className="about-content">
            <p>
              I enjoy solving problems and turning ideas into practical
              software. My interests span frontend development, backend
              engineering, and applied artificial intelligence.
            </p>
            <p>
              My goal is to build reliable, accessible, and meaningful
              applications while continuously improving my engineering skills.
            </p>
            <a className="text-link" href="#contact">
              Let's work together <span>↗</span>
            </a>
          </div>
        </section>

        <section className="skills section container" id="skills">
          <div className="section-heading">
            <p className="eyebrow">02 / MY TOOLKIT</p>
            <h2>Technologies I <span>work with.</span></h2>
            <p className="section-description">
              Tools and technologies I'm learning and using to build software.
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div className="skill-card" key={skill}>
                <span className="skill-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{skill}</span>
                <span className="skill-arrow">↗</span>
              </div>
            ))}
          </div>
        </section>

        <section className="projects section container" id="projects">
          <div className="projects-heading">
            <div className="section-heading">
              <p className="eyebrow">03 / SELECTED WORK</p>
              <h2>Projects with <span>purpose.</span></h2>
            </div>
            <p className="projects-intro">
              A selection of projects that reflect my interest in solving
              real problems through software and data.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className="project-card-top">
                  <span className="project-number">{project.number}</span>
                  <span className="project-category">{project.category}</span>
                </div>

                <div className="project-visual">
                  <span className="project-visual-bracket">{"<"}</span>
                  <span className="project-visual-name">
                    {project.title.split(" ").map((word) => word[0]).join("")}
                  </span>
                  <span className="project-visual-bracket">{"/>"}</span>
                  <div className="project-visual-circle" />
                </div>

                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="technology-list">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>

                <a
                  className="project-link"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore project <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section container" id="contact">
          <div className="contact-panel">
            <p className="eyebrow">04 / GET IN TOUCH</p>
            <h2>
              Have an idea?
              <br />
              <span>Let's build it.</span>
            </h2>
            <p>
              I'm interested in meaningful projects, collaboration, and
              opportunities to learn and grow as a developer.
            </p>
            <a
              className="button button-primary"
              href="mailto:hello@example.com"
            >
              Send Me an Email <span>↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <a className="logo" href="#home">YA<span>.</span></a>
        <p>Designed & built with care.</p>
        <p>© {new Date().getFullYear()} Yohannes Alemayehu</p>
      </footer>
    </>
  );
}

export default App;
