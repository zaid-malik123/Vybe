import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUser from "./hooks/getSuggestedUser";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import getAllPost from "./hooks/getAllPost";
import Reels from "./pages/Reels";
import getAllReel from "./hooks/getAllReels";
import Story from "./pages/Story";
import getAllStory from "./hooks/getAllStory";
import Message from "./pages/Message";
import MessageArea from "./pages/MessageArea";
import { useEffect } from "react";
import { io } from "socket.io-client"
import { setOnlineUsers, setSocket } from "./redux/slice/socketSlice";
import getCurrentUserFollowingList from "./hooks/getUserFollowing";
import getPrevChatUser from "./hooks/getPrevChatUsers";
import Search from "./pages/Search";
import getAllNotification from "./hooks/getAllNotification";
import Notification from "./pages/Notification";


export const serverUrl = "http://localhost:3000";

const App = () => {
  getCurrentUser();
  getSuggestedUser()
  getCurrentUserFollowingList()
  getPrevChatUser()
  getAllStory()
  getAllPost()
  getAllReel()
  getAllNotification()

  const { user } = useSelector((state) => state.userSlice);
  const {socket} = useSelector(state => state.socketSlice)
  const dispatch = useDispatch()

  useEffect(()=>{
   if(user){
    const socketIo = io(serverUrl, {
      query: {userId: user._id}
    })
    dispatch(setSocket(socketIo))
    
    socketIo.on("onlineUsers",(users)=>{
      dispatch(setOnlineUsers(users))
    })

    return ()=> socketIo.close()
   } 
   else{
    if(socket){
      socket.close()
      dispatch(setSocket(null))
    }
   }
   

  },[user])

  return (
    <Routes>
      {/*  If not logged in, show auth pages */}
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/" />}
      />

      {/*  If logged in, go to Home, else Login */}
      <Route
        path="/"
        element={user ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile/:userName"
        element={user ? <Profile/> : <Navigate to="/login" />}
      />
      <Route
        path="/edit-profile"
        element={user ? <EditProfile/> : <Navigate to="/login" />}
      />
       <Route
        path="/upload"
        element={user ? <Upload/> : <Navigate to="/login" />}
      />
       <Route
        path="/reels"
        element={user ? <Reels/> : <Navigate to="/login" />}
      />
      <Route
        path="/story/:userName"
        element={user ? <Story/> : <Navigate to="/login" />}
      />
       <Route
        path="/message"
        element={user ? <Message/> : <Navigate to="/login" />}
      />
       <Route
        path="/message-area"
        element={user ? <MessageArea/>  : <Navigate to="/login" />}
      />
       <Route
        path="/search"
        element={user ? <Search/>  : <Navigate to="/login" />}
      />
      <Route
        path="/notification"
        element={user ? <Notification/>  : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
