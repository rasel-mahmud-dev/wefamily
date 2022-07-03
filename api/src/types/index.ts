import {Request} from "express";

export interface RequestWithAuth extends Request{
  user_id: string
  body: any
  send: any
}