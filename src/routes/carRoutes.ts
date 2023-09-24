import { Router } from "express";

import {
  CreateCarController,
  UpdateCarController,
  DeleteCarController,
} from "../controllers/CarController";

const router: Router = Router();

//Create a new car
router.post("/", CreateCarController);

//Update a car
router.put("/:number_plate", UpdateCarController);

//Delete a car
router.delete("/:number_plate", DeleteCarController);

export default router;
