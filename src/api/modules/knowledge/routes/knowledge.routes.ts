import { Router } from "express";
import { KnowledgeController } from "../controllers/knowledge.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { uploadKnowledgeSchema } from "../validators/knowledge.validator";

const router: Router = Router({ mergeParams: true });
const controller = new KnowledgeController();

const authMiddleware = (req: any, res: any, next: any) => {
	next();
};

router.get("/", authMiddleware, controller.get);
router.post("/upload", authMiddleware, validate(uploadKnowledgeSchema), controller.upload);

export default router;
