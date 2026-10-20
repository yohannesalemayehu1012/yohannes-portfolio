import heroImg from './assets/hero.png'
import './App.css'

const impactStats = [
  { value: '6+', label: 'Years crafting interfaces' },
  { value: '14', label: 'Launches shipped' },
  { value: '92%', label: 'Repeat client rate' },
]

const capabilityGroups = [
  {
    title: 'Frontend',
    items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'MongoDB'],
  },
  {
    title: 'Workflow',
    items: ['Design systems', 'Testing', 'CI/CD', 'Product strategy', 'UX reviews'],
  },
]

const featuredProjects = [
  {
    name: 'Northstar Commerce',
    summary:
      'A conversion-focused storefront that paired performance tuning with an editorial shopping experience.',
    tags: ['React', 'Stripe', 'Analytics'],
    metric: '+38% revenue lift',
  },
  {
    name: 'Signal Board',
    summary:
      'A real-time operations dashboard for cross-functional teams to track delivery, blockers, and status.',
    tags: ['Node.js', 'WebSockets', 'Charts'],
    metric: '4.8/5 avg. rating',
  },
  {
    name: 'Luma Health',
    summary:
      'A patient-first portal helping clinics coordinate care journeys with fewer handoff errors.',
    tags: ['UX Design', 'Accessibility', 'A/B testing'],
    metric: '2x faster onboarding',
  },
]

function App() {
  return (
    <div className="portfolio-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark">Y</span>
          <span>Yohannes</span>
        </div>
        <nav className="nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#tools">Tools</a>
        </nav>
        <a className="contact-link" href="mailto:hello@yohannes.dev">
          Contact
        </a>
      </header>

      <main className="portfolio-page">
        <section className="hero-section" id="about">
          <div className="hero-copy">
            <p className="eyebrow">Full-stack product engineer</p>
            <h1>Building thoughtful digital products that move people and businesses forward.</h1>
            <p className="lead">
              I’m Yohannes, a developer focused on turning ambitious ideas into polished, user-centered experiences.
              My work blends product thinking, clean engineering, and measurable business impact.
            </p>
            <div className="cta-row">
              <a className="primary-button" href="#projects">
                View my work
              </a>
              <a className="secondary-button" href="#tools">
                My stack
              </a>
            </div>
            <ul className="stat-list" aria-label="Key stats">
              {impactStats.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-visual" aria-label="Profile preview">
            <div className="portrait-card">
              <img src={heroImg} alt="Portrait illustration" />
            </div>
            <div className="floating-card">
              <span className="status-dot" aria-hidden="true"></span>
              <div>
                <strong>Open for select collaborations</strong>
                <small>Product design + engineering</small>
              </div>
            </div>
          </div>
        </section>

        <section className="showcase-grid">
          <article className="info-panel">
            <p className="panel-kicker">Approach</p>
            <h2>Product thinking, without sacrificing craft.</h2>
            <p>
              I enjoy bridging the gap between user needs, business goals, and a maintainable technical foundation.
            </p>
          </article>
          <article className="info-panel accent-panel">
            <p className="panel-kicker">Focus</p>
            <h2>Design systems, dashboards, and customer experiences.</h2>
            <p>
              Whether it’s a landing page, internal tool, or full platform, I build with clarity, speed, and scalability in mind.
            </p>
          </article>
        </section>

        <section className="projects-section" id="projects">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Projects with measurable outcomes.</h2>
          </div>

          <div className="project-grid">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.name}>
                <div className="project-meta">
                  <span className="project-badge">Case study</span>
                  <span className="project-metric">{project.metric}</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <ul className="tag-list" aria-label={`${project.name} technology stack`}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="tools-section" id="tools">
          <div className="section-heading">
            <p className="eyebrow">Toolbox</p>
            <h2>Capabilities across product teams.</h2>
          </div>

          <div className="tool-grid">
            {capabilityGroups.map((group) => (
              <div className="tool-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-banner" aria-label="Contact call to action">
          <div>
            <p className="panel-kicker">Let’s build</p>
            <h2>Need a product partner who can move from idea to launch?</h2>
          </div>
          <a className="primary-button" href="mailto:hello@yohannes.dev">
            hello@yohannes.dev
          </a>
        </section>
      </main>
    </div>
  )
}

export default App
