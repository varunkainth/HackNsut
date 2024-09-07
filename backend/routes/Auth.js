import { Router } from "express";
import { Github, Google, login, Register } from "../controllers/AuthController";
const router = Router();

router.post("/register", Register);
router.post("/login", login);
router.post("/google", Google);
router.post("/github", Github);

export default router;
