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

export { CreateParkingController };
