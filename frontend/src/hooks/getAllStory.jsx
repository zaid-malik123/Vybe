import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setStoryList } from "../redux/slice/storySlice";

const getAllStory = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.userSlice) 
  const {story} = useSelector(state => state.storySlice) 
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/story/all-story`, {
          withCredentials: true,
        });
        dispatch(setStoryList(res.data))
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchStory()
  }, [dispatch, user, story]);
};

export default getAllStory;
