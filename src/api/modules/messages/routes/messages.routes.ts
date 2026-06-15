import { Router } from "express";
import { MessagesController } from "../controllers/messages.controller";
import { authMiddleware, requireAgentAccess } from "@/api/middlewares/auth.middleware";
import { validate } from "@/api/middlewares/validate.middleware";
import { sendMessageSchema } from "../validators/message.validator";

const router: Router = Router({ mergeParams: true });
const controller = new MessagesController();

router.use(authMiddleware);
router.use(requireAgentAccess);

router.get("/", controller.list);
router.post("/send", validate(sendMessageSchema), controller.send);

export default router;
