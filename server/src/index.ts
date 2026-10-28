
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

const PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Reject cross-origin browser requests that attempt to change data.
app.use((req, res, next) => {
  const changesData = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (!changesData) {
    next();
    return;
  }

  if (req.get("origin") !== CLIENT_ORIGIN) {
    res.status(403).json({
      success: false,
      message: "Request origin is not allowed.",
    });
    return;
  }

  next();
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio API: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
