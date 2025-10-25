import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "../redux/slice/userSlice";


const getCurrentUserFollowingList = () => {
  const dispatch = useDispatch() 
  const {user} = useSelector(state => state.userSlice)
  useEffect(() => {
    const fetchUserFollowingList = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/following`, {
          withCredentials: true,
        });
       dispatch(setFollowing(res.data))
   
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserFollowingList()
  }, [user]);
};

export default getCurrentUserFollowingList;
