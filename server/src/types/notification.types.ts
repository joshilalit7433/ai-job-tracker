import {  Document, Types } from "mongoose";

export interface INotification extends Document {
  user: Types.ObjectId;
  title?: string;
  companyName?: string;
  location?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
