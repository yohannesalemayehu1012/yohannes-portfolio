
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { socialLinks } from "./data/socialLinks";
import { getProjects, type Project } from "./services/projectService";
import ContactForm from "./ContactForm";
import "./App.css";

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

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const data = await getProjects();

        if (active) {
          setProjects(data);
        }
      } catch (error) {
        if (active) {
          setProjectError(
            error instanceof Error
              ? error.message
              : "Unable to load projects."
          );
        }
      } finally {
        if (active) {
          setLoadingProjects(false);
        }
      }
    }

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        projects
          .map((project) => project.category.trim())
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories.sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchableText = [
        project.title,
        project.description,
        project.category,
        ...project.technologies,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [projects, searchTerm, selectedCategory]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="header">
        <nav className="navbar container">
          <a className="logo" href="#home" onClick={closeMenu}>
            YA<span>.</span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div
            id="primary-navigation"
            className={`nav-links ${menuOpen ? "nav-open" : ""}`}
          >
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

      <main id="main-content" tabIndex={-1}>
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
              <a
                className="button button-resume"
                href="/resume.pdf"
                download="Yohannes-Alemayehu-CV.pdf"
              >
                Download CV <span>↓</span>
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

        <section className="about section" id="about">
          <div className="container">
            <div className="about-layout">
              <div className="section-heading">
                <p className="section-eyebrow eyebrow">01 / ABOUT ME</p>
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
            </div>
          </div>
        </section>

        <section className="skills section" id="skills">
          <div className="container">
            <div className="section-heading">
              <p className="section-eyebrow eyebrow">02 / MY TOOLKIT</p>
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
          </div>
        </section>

        <section className="projects section" id="projects">
          <div className="container">
            <div className="projects-heading">
              <div className="section-heading">
                <p className="section-eyebrow eyebrow">03 / SELECTED WORK</p>
                <h2>Projects with <span>purpose.</span></h2>
              </div>
              <p className="projects-intro">
                A selection of projects that reflect my interest in solving
                real problems through software and data.
              </p>
            </div>

            {!loadingProjects && !projectError && projects.length > 0 && (
              <div className="project-filters">
                <div className="project-search">
                  <label htmlFor="project-search">Search projects</label>

                  <input
                    id="project-search"
                    type="search"
                    placeholder="Search by name, technology..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>

                <div className="category-filter">
                  <p>Filter by category</p>

                  <div className="category-buttons">
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={
                          selectedCategory === category
                            ? "category-button active"
                            : "category-button"
                        }
                        aria-pressed={selectedCategory === category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-results">
                  <span>
                    Showing {filteredProjects.length} of {projects.length} projects
                  </span>

                  {(searchTerm || selectedCategory !== "All") && (
                    <button
                      type="button"
                      className="clear-filters"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                    >
                      Clear filters ×
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="projects-grid">
              {loadingProjects ? (
                <p className="project-status" role="status">
                  Loading projects...
                </p>
              ) : projectError ? (
                <div className="project-status project-error" role="alert">
                  <p>We couldn't load the projects.</p>
                  <p>{projectError}</p>
                  <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
              ) : projects.length === 0 ? (
                <p className="project-status">
                  No projects have been published yet.
                </p>
              ) : filteredProjects.length === 0 ? (
                <div className="project-status no-project-results">
                  <h3>No projects found</h3>
                  <p>
                    Try another search keyword or select a different category.
                  </p>

                  <button
                    type="button"
                    className="retry-button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                  >
                    Show all projects
                  </button>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <article className="project-card" key={project.id}>
                    {project.featured && (
                      <span className="featured-label">Featured</span>
                    )}

                    <p className="project-category">{project.category}</p>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    <div className="project-technologies">
                      {project.technologies.map((technology) => (
                        <span key={technology}>{technology}</span>
                      ))}
                    </div>

                    <div className="project-card-actions">
                      <Link
                        to={`/projects/${project.id}`}
                        className="project-details-link"
                      >
                        View Details ↗
                      </Link>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <ContactForm />
      </main>

      <footer className="footer container">
        <div className="footer-top">
          <a className="logo" href="#home">
            YA<span>.</span>
          </a>

          <div className="footer-socials">
            {socialLinks
              .filter((social) => social.url.trim() !== "")
              .map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.name} profile`}
                >
                  {social.name} ↗
                </a>
              ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>Designed & built with care.</p>
          <p>© {new Date().getFullYear()} Yohannes Alemayehu</p>
        </div>
      </footer>
    </>
  );
}

export default App;
