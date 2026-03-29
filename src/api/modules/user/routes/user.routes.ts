import { Router } from "express";
import { UserController } from "../controllers/auth.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { createUserSchema } from "../validators";

const router: Router = Router();
const controller = new UserController();

router.post("/create", validate(createUserSchema), controller.create);

export default router;
