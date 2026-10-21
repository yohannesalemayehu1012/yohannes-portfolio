import { Router } from "express";
import { projects } from "../data/projects.js";
const router = Router();
// GET /api/projects
// Return all portfolio projects.
router.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
    });
});
// GET /api/projects/:id
// Return one project by its ID.
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
            success: false,
            message: "Project ID must be a positive integer.",
        });
        return;
    }
    const project = projects.find((item) => item.id === id);
    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project not found.",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: project,
    });
});
export default router;
