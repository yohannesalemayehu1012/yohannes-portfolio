
import Database from "better-sqlite3";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

// Store the database file in the server directory.
const databasePath = resolve(currentDirectory, "../portfolio.db");

export const db = new Database(databasePath);

// Improve SQLite's handling of concurrent reads and writes.
db.pragma("journal_mode = WAL");

// Create the projects table if it does not exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT NOT NULL,
    githubUrl TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0
      CHECK (featured IN (0, 1))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0
      CHECK (is_read IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert starter projects only when the table is empty.
const projectCount = db
  .prepare("SELECT COUNT(*) AS count FROM projects")
  .get() as { count: number };

if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (
      title,
      category,
      description,
      technologies,
      githubUrl,
      featured
    )
    VALUES (
      @title,
      @category,
      @description,
      @technologies,
      @githubUrl,
      @featured
    )
  `);

  const starterProjects = [
    {
      title: "Disease Prediction System",
      category: "Machine Learning",
      description:
        "A machine learning application for predicting potential health risks from medical data.",
      technologies: ["Python", "Scikit-learn", "FastAPI"],
      githubUrl: "https://github.com/",
      featured: 1,
    },
    {
      title: "School Management System",
      category: "Full-Stack Development",
      description:
        "An application for managing students, teachers, and school records.",
      technologies: ["ASP.NET Core", "C#", "SQL"],
      githubUrl: "https://github.com/",
      featured: 1,
    },
    {
      title: "House Price Prediction",
      category: "Data Science",
      description:
        "A regression model that estimates house prices from property features.",
      technologies: ["Python", "Pandas", "Flask"],
      githubUrl: "https://github.com/",
      featured: 0,
    },
  ];

  const seedProjects = db.transaction(() => {
    for (const project of starterProjects) {
      insertProject.run({
        ...project,
        technologies: JSON.stringify(project.technologies),
      });
    }
  });

  seedProjects();

  console.log("Starter projects inserted into SQLite.");
}

console.log(`SQLite database initialized: ${databasePath}`);
