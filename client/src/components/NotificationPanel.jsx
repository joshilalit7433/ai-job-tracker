import { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Briefcase, Building2, MapPin, CalendarDays, Clock,Trash2 } from "lucide-react";
import {  NOTIFICATION_API_END_POINT } from "../utils/constant";
import { toast } from "react-toastify";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${NOTIFICATION_API_END_POINT}`, {
          withCredentials: true,
        });
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleDelete = async (n_id) =>{
     if (!window.confirm("Are you sure you want to remove this notification?"))
      return;

    try {
      const res = await axios.delete(
        `${NOTIFICATION_API_END_POINT}/clear/${n_id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Notification removed successfully");
        setNotifications(notifications.filter((notifications)=>notifications._id !==n_id));
      } else {
        toast.error(res.data.message || "Failed to delete notification");
      }
    } catch  {
      toast.error("Something went wrong while deleting.");
    }

  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-blue-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800">Job Notifications</h2>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center italic">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-1 text-blue-700 font-semibold">
                <Briefcase className="w-4 h-4" />
                <span>{n.title}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-4 h-4" />
                <span>{n.company_name}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{n.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                <CalendarDays className="w-4 h-4" />
                <span>{formatDate(n.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(n.createdAt)}</span>
              </div>

               <button
                    onClick={() => handleDelete(n._id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-800 rounded-md px-4 py-2 text-sm font-medium shadow hover:bg-gray-100 transition duration-200"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                    Remove
                  </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
