import { Router } from "express";
import { AgentConfigController } from "../controllers/agent-config.controller";

const router: Router = Router({ mergeParams: true });
const controller = new AgentConfigController();

const authMiddleware = (req: any, res: any, next: any) => {
    next();
};

router.get("/", authMiddleware, controller.getAll);
router.get("/:key", authMiddleware, controller.getByKey);
router.put("/:key", authMiddleware, controller.set);
router.delete("/:key", authMiddleware, controller.remove);

export default router;
