import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setUser } from "../redux/slice/userSlice";
import { setCurrentUserStory } from "../redux/slice/storySlice";

const getCurrentUser = () => {
  const dispatch = useDispatch() 
  const {story} = useSelector(state => state.storySlice) 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/curr-user`, {
          withCredentials: true,
        });
       dispatch(setUser(res.data))
       dispatch(setFollowing(res.data.following))
       dispatch(setCurrentUserStory(res.data.story))
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser()
  }, [story]);
};

export default getCurrentUser;
