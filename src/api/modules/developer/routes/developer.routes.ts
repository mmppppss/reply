import { Router } from "express";
import { DeveloperController } from "../controllers/developer.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { createApiKeySchema } from "../validators/developer.validator";
import { authMiddleware } from "@/api/middlewares/auth.middleware";

const router: Router = Router();
const controller = new DeveloperController();

router.use(authMiddleware);

router.get("/keys", controller.listKeys);
router.post("/keys", validate(createApiKeySchema), controller.createKey);
router.delete("/keys/:id_key", controller.revokeKey);
router.get("/logs", controller.listLogs);

export default router;
