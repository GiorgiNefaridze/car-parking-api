import { Router } from "express";

const router: Router = Router();

//Regiter user into database
router.post("register", () => {});

//Login into the application as an user
router.post("log-in", () => {});

//Password recovery
router.post("password-recovery", () => {});

export default router;
