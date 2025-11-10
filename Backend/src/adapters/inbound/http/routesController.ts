import { Request, Response, Router } from "express";
import { RouteRepository } from "@/core/ports";
import {
  createListRoutes,
  createSetBaseline,
  createComputeComparison,
} from "@/core/application";

export function makeRoutesController(repo: RouteRepository) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    try {
      const listRoutes = createListRoutes(repo);
      const routes = await listRoutes.execute();
      res.json(routes);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  router.post("/:id/baseline", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const setBaseline = createSetBaseline(repo);
      await setBaseline.execute({ id });
      res.json({ message: `Baseline set for route ${id}` });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  router.get("/comparison", async (_req: Request, res: Response) => {
    try {
      const compare = createComputeComparison(repo);
      const result = await compare.execute();
      res.json(result);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}
