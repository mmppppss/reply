import { Router } from "express";
import { MessagesController } from "../controllers/messages.controller";

const router: Router = Router({ mergeParams: true });
const controller = new MessagesController();

const authMiddleware = (req: any, res: any, next: any) => {
    next();
};

router.get("/", authMiddleware, controller.list);

export default router;
