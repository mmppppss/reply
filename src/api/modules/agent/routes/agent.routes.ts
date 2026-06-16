import { Router } from "express";
import { AgentController } from "../controllers/agent.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { createAgentSchema, updateAgentSchema, sendAgentMessageSchema } from "../validators";

const router: Router = Router({ mergeParams: true });
const controller = new AgentController();

// Auth middleware placeholder - replace with actual auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
	next();
};

router.post(
	"/",
	authMiddleware,
	validate(createAgentSchema),
	controller.create,
);

router.post("/:id_agent/connect", authMiddleware, controller.connect);

router.get("/", authMiddleware, controller.getAll);
router.get("/:id_agent", authMiddleware, controller.getById);
router.put(
	"/:id_agent",
	authMiddleware,
	validate(updateAgentSchema),
	controller.update,
);
router.delete("/:id_agent", authMiddleware, controller.delete);

router.post("/:id_agent/send", authMiddleware, validate(sendAgentMessageSchema), controller.send);

export default router;
