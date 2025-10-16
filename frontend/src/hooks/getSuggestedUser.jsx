import  { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUser } from "../redux/slice/userSlice";

const getSuggestedUser = () => {
  const {user} = useSelector(state => state.userSlice)  
  const dispatch = useDispatch()  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/suggested-user`, {
          withCredentials: true,
        });
        console.log(res.data)
       dispatch(setSuggestedUser(res.data))
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser()
  }, [user]);
};

export default getSuggestedUser;
