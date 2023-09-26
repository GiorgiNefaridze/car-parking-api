import { pool } from "../database/DbConnection";
import { errorMessages, successMessages } from "../CONSTANTS";
import { IParking } from "../types/ParkingTypes";
import { IController } from "../types/UserTypes";
import { parseHeader } from "../utils/parseHeader";
import { textValidator } from "../utils/textValidator";

const CreateParkingController: IController = async (req, res) => {
  try {
    const { name, address, charge_per_hour } = req.body as IParking;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    if (!textValidator([name, address]) || !charge_per_hour || !userId) {
      throw new Error(errorMessages.invaliCredentials);
    }

    const {
      rows: [credentials],
    } = await pool.query("SELECT isadministrator FROM users WHERE id = $1", [
      userId,
    ]);

    if (!credentials?.isadministrator) {
      throw new Error(errorMessages.noPermission);
    }

    const {
      rows: [response],
    } = await pool.query(
      "INSERT INTO parkingzone (name, address, charge_per_hour, owner_id) VALUES ($1,$2,$3,$4) RETURNING parking_id",
      [name, address, charge_per_hour, userId]
    );

    if (Object.keys(response)?.length) {
      res.status(201).json({ response: successMessages.parkingCreated });
    } else {
      throw new Error(errorMessages.internalError);
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const UpdateParkingController: IController = async (req, res) => {
  try {
    const { name } = req.params;
    const {
      name: parking_zone_name,
      address,
      charge_per_hour,
    } = req.body as IParking;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    if (
      !textValidator([name, address, parking_zone_name]) ||
      !charge_per_hour ||
      !userId
    ) {
      throw new Error(errorMessages.invaliCredentials);
    }

    const {
      rows: [credentials],
    } = await pool.query("SELECT isadministrator FROM users WHERE id = $1", [
      userId,
    ]);

    if (!credentials?.isadministrator) {
      throw new Error(errorMessages.noPermission);
    }

    const {
      rows: [result],
    } = await pool.query(
      "UPDATE parkingzone SET name = $1, address = $2,charge_per_hour = $3 WHERE owner_id = $4 AND name = $5 RETURNING parking_id",
      [parking_zone_name, address, charge_per_hour, userId, name]
    );

    if (result && Object.keys(result)?.length) {
      res.status(201).json({ response: successMessages.parkingUpdated });
    } else {
      throw new Error(errorMessages.internalError);
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const DeleteParkingController: IController = async (req, res) => {
  try {
    const { name } = req.params;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    if (!textValidator([name]) || !userId) {
      throw new Error(errorMessages.invaliCredentials);
    }

    const {
      rows: [credentials],
    } = await pool.query("SELECT isadministrator FROM users WHERE id = $1", [
      userId,
    ]);

    if (!credentials?.isadministrator) {
      throw new Error(errorMessages.noPermission);
    }

    const {
      rows: [result],
    } = await pool.query(
      "DELETE FROM parkingzone WHERE name = $1 RETURNING parking_id",
      [name]
    );

    if (result && Object.keys(result)?.length) {
      res.status(200).json({ response: successMessages.parkingRemoved });
    } else {
      throw new Error(errorMessages.internalError);
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const BookParkingController: IController = async (req, res) => {
  try {
    const { numberPlate, zoneName } = req.body;
    const token = req.headers["authorization"] as string;

    const userId = parseHeader(token);

    if (!textValidator([numberPlate, zoneName]) || !userId) {
      throw new Error(errorMessages.invaliCredentials);
    }

    const {
      rows: [car],
    } = await pool.query(
      "SELECT car_id FROM cars WHERE number_plate = $1 AND owner_id = $2",
      [numberPlate, userId]
    );

    const {
      rows: [parking],
    } = await pool.query(
      "SELECT parking_id, charge_per_hour FROM parkingzone WHERE name = $1 AND owner_id = $2",
      [zoneName, userId]
    );

    const {
      rows: [user],
    } = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);

    if (
      !(car && Object.keys(car)?.length) ||
      !(parking && Object.keys(parking)?.length)
    ) {
      throw new Error(errorMessages.noPermission);
    }

    const {
      rows: [booking],
    } = await pool.query(
      "INSERT INTO bookingparking (car_id,owner_id,parking_id) VALUES ($1, $2, $3) RETURNING booking_id",
      [car?.car_id, userId, parking?.parking_id]
    );

    if (booking && Object.keys(booking)?.length) {
      if (user?.balance <= parking?.charge_per_hour) {
        throw new Error(errorMessages.noBalance);
      }

      await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [
        user?.balance - parking.charge_per_hour,
        userId,
      ]);
      res.status(200).json({ response: successMessages.booked });
    } else {
      throw new Error(errorMessages.internalError);
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const GetBokingController: IController = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

export {
  CreateParkingController,
  UpdateParkingController,
  DeleteParkingController,
  BookParkingController,
  GetBokingController,
};
