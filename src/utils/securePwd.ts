import { genSalt, hash, compare } from "bcrypt";
import { config } from "dotenv";

config();

const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(Number(process.env.SALT));

  return await hash(password, salt);
};

const unHashPassword = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  return await compare(plainPassword, hash);
};

export { hashPassword, unHashPassword };
