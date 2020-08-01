import { Request, Response } from "express";
import { EntityManager } from "@mikro-orm/postgresql";

declare module "express-serve-static-core" {
  interface Request {}
}

export interface BaseContext {
  req: Request;
  res: Response;
  em: EntityManager;
}
