import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setFollowing, setUser } from "../redux/slice/userSlice";

const getCurrentUser = () => {
  const dispatch = useDispatch()  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/curr-user`, {
          withCredentials: true,
        });
       dispatch(setUser(res.data))
       dispatch(setFollowing(res.data.following))
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser()
  }, []);
};

export default getCurrentUser;
