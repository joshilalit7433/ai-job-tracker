import { model,Schema } from "mongoose";
import { INotification } from "../types/notification.types";

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    companyName: {
      type: String,
    },
    location: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", notificationSchema);

