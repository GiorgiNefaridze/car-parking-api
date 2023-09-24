import { Response, Request } from "express";

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdministrator: boolean;
}

export interface IController {
  (req: Request, res: Response): Promise<void>;
}

export interface IUserExists {
  (email: string): Promise<boolean>;
}
