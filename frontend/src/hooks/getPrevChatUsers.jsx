import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPrevChatUsers } from "../redux/slice/messageSlice";


const getPrevChatUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { messages } = useSelector((state) => state.messageSlice);
  useEffect(() => {
    const fetchPrevUserChats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/message/prev-chat`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(res.data))
      } catch (error) {
        console.log(error);
      }
    };
    fetchPrevUserChats();
  }, [user, messages]);
};

export default getPrevChatUser;
