import { Router } from "express";
import { WhatsappController } from "../controllers/whatsapp.controller";
import { validate } from "@/api/middlewares/validate.middleware";
const router: Router = Router();
const controller = new WhatsappController();

router.post("/:userId/whatsapp/connect", controller.connect);
router.get("/:userId/whatsapp/sessions", controller.sessions);

export default router;
