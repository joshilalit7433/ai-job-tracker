import { Request } from "express";

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: number;
  role: string;
  resume?: string;
  coverLetter?: string;
}


export interface AuthRequest<
  Params = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: AuthUser;
}
