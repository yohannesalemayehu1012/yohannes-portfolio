import { Router } from "express";
import { db } from "../db.js";
const router = Router();
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
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
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
export default router;
