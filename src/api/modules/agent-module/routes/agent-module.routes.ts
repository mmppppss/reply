import { Router } from "express";
import { AgentModuleController } from "../controllers/agent-module.controller";

const router: Router = Router({ mergeParams: true });
const controller = new AgentModuleController();

const authMiddleware = (req: any, res: any, next: any) => {
    next();
};

router.get("/", authMiddleware, controller.list);
router.put("/:module_key", authMiddleware, controller.upsert);
router.post("/:module_key/toggle", authMiddleware, controller.toggle);
router.delete("/:module_key", authMiddleware, controller.remove);

export default router;
