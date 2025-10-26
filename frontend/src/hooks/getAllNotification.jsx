import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/slice/notificationSlice";

const useGetAllNotification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);

  useEffect(() => {
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

    if (user) fetchNotification();
  }, [user, dispatch]);
};

export default useGetAllNotification;
