import { textValidator } from "../utils/textValidator";
import { isUserExists } from "../utils/isUserExists";
import { hashPassword, unHashPassword } from "../utils/securePwd";
import { generateToken } from "../utils/jwtGenerator";
import { IUser, IUserController } from "../types/UserTypes";
import { pool } from "../database/DbConnection";
import { errorMessages, successMessages } from "../CONSTANTS";

const RegisterController: IUserController = async (req, res) => {
  try {
    const body = req.body;
    const { firstname, lastname, email, password } = body as IUser;

    if (!textValidator([firstname, lastname, email, password])) {
      throw new Error(errorMessages.invaliCredentials);
    }

    if (await isUserExists(email)) {
      throw new Error(errorMessages.userExists);
    }

    const hashedPassword: string = await hashPassword(password);

    const newUser = await pool.query(
      "INSERT INTO users (firstname,lastname,email,password) VALUES ($1,$2,$3,$4) RETURNING *",
      [firstname, lastname, email, hashedPassword]
    );

    if (Object.keys(newUser.rows[0])?.length) {
      res.status(201).json({ response: successMessages.userCreated });
    }

    throw new Error(errorMessages.internalError);
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

const LoginController: IUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!textValidator([email, password])) {
      throw new Error(errorMessages.invaliCredentials);
    }

    if (!(await isUserExists(email))) {
      throw new Error(errorMessages.invaliCredentials);
    }

    const user = await pool.query(
      "SELECT id,password FROM users WHERE email = $1",
      [email]
    );

    const plainPassword = await unHashPassword(
      password,
      user.rows[0]?.password
    );

    if ((await isUserExists(email)) && plainPassword) {
      res.status(200).json({ response: generateToken(user.rows[0]?.id) });
    } else {
      throw new Error(errorMessages.invaliCredentials);
    }
  } catch (error) {
    res.status(500).json({ response: error?.message });
  }
};

export { RegisterController, LoginController };
