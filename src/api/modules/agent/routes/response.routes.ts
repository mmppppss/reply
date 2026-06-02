import { Router } from "express";
import { ResponseController } from "../controllers/response.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { updateResponseSchema } from "../validators";

const router: Router = Router({ mergeParams: true });
const controller = new ResponseController();

// Auth middleware placeholder
const authMiddleware = (req: any, res: any, next: any) => {
	next();
};

router.post("/", authMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.put("/:id_response", authMiddleware, validate(updateResponseSchema), controller.update);
router.delete("/:id_response", authMiddleware, controller.remove);

export default router;
