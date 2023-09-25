import { Router } from "express";

import {
  CreateParkingController,
  UpdateParkingController,
} from "../controllers/ParkingController";

const router: Router = Router();

//Create the parking zone
router.post("/", CreateParkingController);

//Update the parking zone
router.put("/:name", UpdateParkingController);

//Delete the parking zone
router.delete("/:name", () => {});

export default router;
