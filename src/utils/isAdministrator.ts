import { pool } from "../database/DbConnection";

export const isAdministrator = async (userId: string): Promise<boolean> => {
  const {
    rows: [credentials],
  } = await pool.query("SELECT isadministrator FROM users WHERE id = $1", [
    userId,
  ]);

  return credentials?.isAdministrator;
};
