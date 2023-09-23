import { Request, Response } from "express";

import { textValidator } from "../utils/textValidator";
import { errorMessages } from "../CONSTANTS";

interface IRegister {
  (req: Request, res: Response): void;
}

const RegisterController: IRegister = (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!textValidator([firstName, lastName, email, password])) {
      throw new Error(errorMessages.invaliCredentials);
    }
  } catch (error) {
    res.status(500).json({ response: error.message });
  }
};

export { RegisterController };
