import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "@/api/middlewares/validate.middleware";
import { login } from "../validators";
const router: Router = Router();
const controller = new AuthController();

router.post("/login", validate(login), controller.login);

export default router;
