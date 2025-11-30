/**
 * SoftOne Design System - Backend Mock Server
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   Express + SQLite 기반의 Lightweight Backend Mock입니다.
 *   프론트엔드 개발 중 실제 API 통신을 시뮬레이션합니다.
 *
 * 실행: cd backend-mock && npx ts-node server.ts
 * 또는: npm run mock-server (package.json에 스크립트 추가 후)
 */

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import gridRoutes from "./routes/gridRoutes";
import { closeDb } from "./db/sqliteClient";

// ========================================
// Express App Setup
// ========================================

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ========================================
// Routes
// ========================================

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Grid API Routes
app.use("/api/grid", gridRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Error]", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ========================================
// Server Start
// ========================================

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   SoftOne Design System - Backend Mock Server                 ║
║                                                               ║
║   Server running on: http://localhost:${PORT}                   ║
║                                                               ║
║   Available endpoints:                                        ║
║     GET /api/health          - Health check                   ║
║     GET /api/grid/users      - User grid data                 ║
║     GET /api/grid/orders     - Order grid data                ║
║     GET /api/grid/sales      - Sales grid data                ║
║                                                               ║
║   Query params: page, pageSize, keyword, status, category,    ║
║                 sortField, sortDir                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("\n[Server] Shutting down...");
  closeDb();
  server.close(() => {
    console.log("[Server] Closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\n[Server] Shutting down...");
  closeDb();
  server.close(() => {
    console.log("[Server] Closed");
    process.exit(0);
  });
});

