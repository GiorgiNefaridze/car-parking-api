import { Router } from "express";

import {
  RegisterController,
  LoginController,
} from "../controllers/UserController";

const router: Router = Router();

//Regiter user into database
router.post("/register", RegisterController);

//Login into the application as an user
router.post("/log-in", LoginController);

//Password recovery
router.post("password-recovery", () => {});

export default router;
