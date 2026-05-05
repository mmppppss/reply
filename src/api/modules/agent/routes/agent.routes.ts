import { Router } from "express";
import { AgentController } from "../controllers/agent.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { createAgentSchema, updateAgentSchema } from "../validators";

const router: Router = Router({ mergeParams: true });
const controller = new AgentController();

// Auth middleware placeholder - replace with actual auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	next();
};

router.post("/",
	authMiddleware,
	validate(createAgentSchema),
	controller.create
);
router.get("/", authMiddleware, controller.getAll);
router.get("/:agentId", authMiddleware, controller.getById);
router.put("/:agentId", authMiddleware, validate(updateAgentSchema), controller.update);
router.delete("/:agentId", authMiddleware, controller.delete);

export default router;
