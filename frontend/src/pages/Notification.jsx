import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../components/NotificationCard";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { setNotificationData } from "../redux/slice/notificationSlice";

const Notification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector((state) => state.notificationSlice);
  const ids = notificationData.map((n) => n._id);

  const fetchNotification = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/notification`, {
        withCredentials: true,
      });
      dispatch(setNotificationData(res.data));
    } catch (error) {
      console.log(error);
    }
  };
  const markAsRead = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/markAsRead`,
        { notificationId: ids },
        { withCredentials: true }
      );
      await fetchNotification();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    markAsRead();
  }, []);
  return (
    <div className="w-full min-h-screen bg-black flex justify-center">
      <div className="w-full sm:w-[500px] md:w-[600px] h-full relative">
        {/* Header */}
        <div className="w-full h-[70px] flex items-center gap-4 px-4 sticky top-0 bg-black z-50 border-b border-gray-800">
          <LuArrowLeft
            onClick={() => navigate("/")}
            className="text-white cursor-pointer w-6 h-6"
          />
          <h1 className="text-white text-[20px] font-semibold">
            Notifications
          </h1>
        </div>

        {/* Notification List */}
        <div className="w-full flex flex-col gap-3 p-4 overflow-y-auto pb-[80px]">
          {notificationData?.length > 0 ? (
            notificationData.map((noti, idx) => (
              <NotificationCard key={idx} noti={noti} />
            ))
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No notifications yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
