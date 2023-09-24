import { pool } from "../database/DbConnection";
import { IController } from "../types/UserTypes";
import { ICar } from "../types/CarTypes";
import { textValidator } from "../utils/textValidator";
import { errorMessages, successMessages } from "../CONSTANTS";
import { parseHeader } from "../utils/parseHeader";

const CreateCarController: IController = async (req, res) => {
  try {
    const { name, number_plate, type } = req.body as ICar;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    if (!textValidator([name, number_plate, type])) {
      throw new Error(errorMessages.invaliCredentials);
    }

    const createCar = await pool.query(
      "INSERT INTO cars (name,number_plate,car_type,owner_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, number_plate, type, userId]
    );

    if (Object.keys(createCar.rows[0]).length) {
      res.status(201).json({ response: successMessages.carCreated });
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const UpdateCarController: IController = async (req, res) => {
  try {
    const { number_plate } = req.params;
    const { name, number_plate: car_number_plate, car_type } = req.body;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    const {
      rows: [result],
    } = await pool.query(
      "SELECT EXISTS (SELECT * FROM cars WHERE number_plate = $1 AND owner_id = $2) AS isOwner",
      [number_plate, userId]
    );

    if (!result?.isowner) {
      throw new Error(errorMessages.noPermission);
    }

    await pool.query(
      "UPDATE cars SET name = $1, number_plate = $2, car_type = $3 WHERE owner_id = $4",
      [name, car_number_plate, car_type, userId]
    );

    res.status(201).json({ response: successMessages.changedCarDetails });
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const DeleteCarController: IController = async (req, res) => {
  try {
    const { number_plate } = req.params;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    const {
      rows: [result],
    } = await pool.query(
      "SELECT EXISTS (SELECT * FROM cars WHERE number_plate = $1 AND owner_id = $2) AS isOwner",
      [number_plate, userId]
    );

    if (!result?.isowner) {
      throw new Error(errorMessages.noPermission);
    }

    const {
      rows: [deletedResult],
    } = await pool.query(
      "DELETE FROM cars WHERE number_plate = $1 AND owner_id = $2 RETURNING car_id",
      [number_plate, userId]
    );

    if (Object.keys(deletedResult)?.length) {
      res.status(200).json({ response: successMessages.carRemoved });
    } else {
      throw new Error(errorMessages.internalError);
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

export { CreateCarController, UpdateCarController, DeleteCarController };
