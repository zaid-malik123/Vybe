import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUser from "./hooks/getSuggestedUser";
import Profile from "./pages/Profile";

export const serverUrl = "http://localhost:3000";

const App = () => {
  getCurrentUser();
  getSuggestedUser()

  const { user } = useSelector((state) => state.userSlice);

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
    </Routes>
  );
};

export default App;
