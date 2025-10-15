import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

export const serverUrl = "http://localhost:3000"
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
      </Routes>
    </div>
  );
};

export default App;
