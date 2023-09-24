import { pool } from "../database/DbConnection";
import { IUserExists } from "../types/UserTypes";

export const isUserExists: IUserExists = async (email) => {
  const isExists = await pool.query(
    "SELECT EXISTS (SELECT * FROM users WHERE email = $1)",
    [email]
  );

  return isExists.rows[0].exists;
};
