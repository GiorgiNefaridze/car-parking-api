import { Router } from "express";

import {
  RegisterController,
  LoginController,
  resetPasswordController,
} from "../controllers/UserController";

const router: Router = Router();

//Regiter user into database
router.post("/register", RegisterController);

//Login into the application as an user
router.post("/log-in", LoginController);

//Password recovery
router.post("/password/recovery", resetPasswordController);

export default router;
