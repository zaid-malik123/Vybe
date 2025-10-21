import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice/userSlice";
import { setReels } from "../redux/slice/reelSlice";


const getAllReel = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.userSlice)  
  useEffect(() => {
    const fetchReel = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/reel/all-reels`, {
          withCredentials: true,
        });
        dispatch(setReels(res.data))
       console.log(res.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchReel()
  }, [dispatch, user]);
};

export default getAllReel;
