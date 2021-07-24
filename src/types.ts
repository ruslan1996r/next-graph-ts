import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from "express";


export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: any }; // Express.Session. Этот тип козлит из-за версии библиотеки
  res: Response;
};