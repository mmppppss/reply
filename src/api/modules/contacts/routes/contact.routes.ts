import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";

const router: Router = Router({ mergeParams: true });
const controller = new ContactController();

const authMiddleware = (req: any, res: any, next: any) => {
    next();
};

router.get("/", authMiddleware, controller.list);
router.get("/:contact_id", authMiddleware, controller.getByContactId);
router.post("/", authMiddleware, controller.create);
router.put("/:contact_id", authMiddleware, controller.update);
router.delete("/:contact_id", authMiddleware, controller.delete);

export default router;
