import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import projectRoutes from "././routes/projectRoutes.js";
const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
// Security headers
app.use(helmet());
// Allow requests from our frontend
app.use(cors({
    origin: CLIENT_ORIGIN,
}));
// Parse incoming JSON
app.use(express.json({ limit: "1mb" }));
// Health-check endpoint
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio API is running",
        timestamp: new Date().toISOString(),
    });
});
// Project endpoints
app.use("/api/projects", projectRoutes);
// Handle unknown API endpoints
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found.",
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Portfolio API: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});
