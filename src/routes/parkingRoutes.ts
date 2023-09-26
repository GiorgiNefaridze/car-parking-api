import { Router } from "express";

import {
  CreateParkingController,
  UpdateParkingController,
  DeleteParkingController,
  BookParkingController,
} from "../controllers/ParkingController";

const router: Router = Router();

//Create the parking zone
router.post("/", CreateParkingController);

//Update the parking zone
router.put("/:name", UpdateParkingController);

//Delete the parking zone
router.delete("/:name", DeleteParkingController);

//Get all data about the parking zone
router.get("/booking", () => {});

//Book parking zone
router.post("/booking", BookParkingController);

export default router;
