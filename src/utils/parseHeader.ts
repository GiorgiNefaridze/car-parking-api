import { verifyToken } from "./jwtGenerator";
import { errorMessages } from "../CONSTANTS";

export const parseHeader = (token: string): string => {
  const validToken = token?.split(" ");

  if (validToken?.[1].length && validToken[0] === "Bearer") {
    return verifyToken(validToken[1])?.id.toString();
  }

  return errorMessages.missingToken;
};
