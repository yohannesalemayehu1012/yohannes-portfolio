import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
const router = Router();
const projectSchema = z.object({
    title: z.string().trim().min(2).max(100),
    category: z.string().trim().min(2).max(60),
    description: z.string().trim().min(10).max(1000),
    technologies: z.array(z.string().trim().min(1).max(40)).min(1).max(15),
    githubUrl: z.string().url().max(2048).refine((value) => {
        try {
            const url = new URL(value);
            return url.protocol === "https:" || url.protocol === "http:";
        }
        catch {
            return false;
        }
    }, { message: "GitHub URL must use HTTP or HTTPS." }),
    featured: z.boolean().default(false),
});
function formatProject(row) {
    return {
        id: row.id,
        title: row.title,
        category: row.category,
        description: row.description,
        technologies: JSON.parse(row.technologies),
        githubUrl: row.githubUrl,
        featured: row.featured === 1,
    };
}
function parseProjectId(value) {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}
function validateProject(body) {
    return projectSchema.safeParse(body);
}
// GET /api/projects
router.get("/", (_req, res) => {
    try {
        const rows = db
            .prepare("SELECT * FROM projects ORDER BY id ASC")
            .all();
        const projects = rows.map(formatProject);
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    }
    catch (error) {
        console.error("Failed to fetch projects:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve projects.",
        });
    }
});
// GET /api/projects/:id
router.get("/:id", (req, res) => {
    const id = parseProjectId(req.params.id);
    if (id === null) {
        res.status(400).json({
            success: false,
            message: "Project ID must be a positive integer.",
        });
        return;
    }
    try {
        const row = db
            .prepare("SELECT * FROM projects WHERE id = ?")
            .get(id);
        if (!row) {
            res.status(404).json({
                success: false,
                message: "Project not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: formatProject(row),
        });
    }
    catch (error) {
        console.error("Failed to fetch project:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve the project.",
        });
    }
});
// POST /api/projects
router.post("/", (req, res) => {
    const result = validateProject(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid project data.",
            errors: result.error.flatten(),
        });
        return;
    }
    const project = result.data;
    try {
        const insert = db.prepare(`
      INSERT INTO projects (
        title,
        category,
        description,
        technologies,
        githubUrl,
        featured
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        const inserted = insert.run(project.title, project.category, project.description, JSON.stringify(project.technologies), project.githubUrl, project.featured ? 1 : 0);
        const row = db
            .prepare("SELECT * FROM projects WHERE id = ?")
            .get(Number(inserted.lastInsertRowid));
        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: formatProject(row),
        });
    }
    catch (error) {
        console.error("Failed to create project:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create project.",
        });
    }
});
// PUT /api/projects/:id
router.put("/:id", (req, res) => {
    const id = parseProjectId(req.params.id);
    if (id === null) {
        res.status(400).json({
            success: false,
            message: "Project ID must be a positive integer.",
        });
        return;
    }
    const result = validateProject(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: "Invalid project data.",
            errors: result.error.flatten(),
        });
        return;
    }
    const project = result.data;
    try {
        const update = db.prepare(`
      UPDATE projects
      SET
        title = ?,
        category = ?,
        description = ?,
        technologies = ?,
        githubUrl = ?,
        featured = ?
      WHERE id = ?
    `);
        const updated = update.run(project.title, project.category, project.description, JSON.stringify(project.technologies), project.githubUrl, project.featured ? 1 : 0, id);
        if (updated.changes === 0) {
            res.status(404).json({
                success: false,
                message: "Project not found.",
            });
            return;
        }
        const row = db
            .prepare("SELECT * FROM projects WHERE id = ?")
            .get(id);
        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: formatProject(row),
        });
    }
    catch (error) {
        console.error("Failed to update project:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update project.",
        });
    }
});
// DELETE /api/projects/:id
router.delete("/:id", (req, res) => {
    const id = parseProjectId(req.params.id);
    if (id === null) {
        res.status(400).json({
            success: false,
            message: "Project ID must be a positive integer.",
        });
        return;
    }
    try {
        const result = db
            .prepare("DELETE FROM projects WHERE id = ?")
            .run(id);
        if (result.changes === 0) {
            res.status(404).json({
                success: false,
                message: "Project not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });
    }
    catch (error) {
        console.error("Failed to delete project:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete project.",
        });
    }
});
export default router;
