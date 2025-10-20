import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slice/userSlice";
import { setPosts } from "../redux/slice/postSlice";

const getAllPost = () => {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.userSlice)  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/post/all-post`, {
          withCredentials: true,
        });
       dispatch(setPosts(res.data))
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost()
  }, [dispatch, user]);
};

export default getAllPost;
