import { sign, verify } from "jsonwebtoken";
import { config } from "dotenv";

config();

const generateToken = (id: number): string => {
  return sign({ id }, process.env.SECRET ?? "secret");
};

const verifyToken = (token: string): { [key: string]: string } => {
  return verify(token, process.env.SECRET);
};

export { generateToken, verifyToken };
