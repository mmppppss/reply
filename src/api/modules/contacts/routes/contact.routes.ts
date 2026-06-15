import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { authMiddleware, requireAgentAccess } from "@/api/middlewares/auth.middleware";

const router: Router = Router({ mergeParams: true });
const controller = new ContactController();

router.use(authMiddleware);
router.use(requireAgentAccess);

router.get("/", controller.list);
router.get("/:contact_id", controller.getByContactId);
router.post("/", controller.create);
router.put("/:contact_id", controller.update);
router.delete("/:contact_id", controller.delete);

export default router;
