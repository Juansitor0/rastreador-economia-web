import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import financialRoutes from "./routes/financial.js";
import fipeRoutes from "./routes/fipe.js";
import calculatorRoutes from "./routes/calculator.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/fipe", fipeRoutes);
app.use("/api/calculator", calculatorRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Serve static files from dist/public in production
const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

app.use(express.static(staticPath));

// Handle client-side routing - serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});
