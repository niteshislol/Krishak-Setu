import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSoilAnalyze } from "./routes/soil";
import { getHeroUrl, saveHeroImage } from "./routes/hero";
import { handleChat } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // AI soil analysis (mock)
  app.post("/api/soil/analyze", handleSoilAnalyze);

  // Simple chatbot endpoint
  app.post("/api/chat", handleChat);

  // Hero image management
  app.get("/api/hero-image/url", getHeroUrl);
  app.post("/api/hero-image", saveHeroImage);

  return app;
}
