import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import { getPool } from "@/infrastructure/db/pool";
import { makePostgresRouteRepository } from "@/adapters/outbound/postgres";
import { makeRoutesController } from "@/adapters/inbound/http/routesController";

async function startServer() {
  const app = express();
  const port = process.env.PORT || 4000;

  app.use(cors());
  app.use(bodyParser.json());
  const pool = getPool();
  const repo = makePostgresRouteRepository(pool);
  app.use("/routes", makeRoutesController(repo));
  app.get("/", (_req, res) => res.send("FuelEU Backend running"));

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
