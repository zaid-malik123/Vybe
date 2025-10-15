import { useState } from "react";
import axios from "axios";
import Logo from "../assets/logo2.png";
import Logo1 from "../assets/logo.png";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slice/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [focused, setFocused] = useState({
    userName: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // clear error on typing
  };

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field, e) => {
    if (!e.target.value) setFocused({ ...focused, [field]: false });
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post(`${serverUrl}/api/auth/login`, formData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data))
      navigate("/");
      toast.success("Login Successfully") // redirect to homepage/dashboard
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";

      if (message.toLowerCase().includes("user does not exist")) {
        setErrors((prev) => ({ ...prev, userName: message }));
      } else if (message.toLowerCase().includes("password is incorrect")) {
        setErrors((prev) => ({ ...prev, password: message }));
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center px-3">
      <div className="w-[95%] lg:max-w-[60%] bg-white rounded-2xl flex justify-center items-center overflow-hidden border border-gray-300 shadow-2xl">
        <div className="w-full lg:w-[50%] h-full flex flex-col items-center py-[40px] gap-[25px]">
          <div className="flex gap-2 items-center text-[22px] font-semibold mt-[10px]">
            <span>Login to</span>
            <img className="w-[80px]" src={Logo} alt="logo" />
          </div>

          {/* Username */}
          <div className="w-[85%] flex flex-col gap-1">
            <div
              className={`relative flex items-center justify-start h-[55px] rounded-2xl border-2 transition-all duration-300 ${
                errors.userName
                  ? "border-red-500"
                  : "border-gray-400 hover:border-black"
              }`}
            >
              <label
                htmlFor="userName"
                className={`absolute left-[20px] px-[5px] bg-white text-[15px] text-gray-700 transition-all duration-300 ${
                  focused.userName ? "top-[-12px] text-[13px]" : "top-[15px]"
                }`}
              >
                Enter your Username
              </label>
              <input
                id="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                onFocus={() => handleFocus("userName")}
                onBlur={(e) => handleBlur("userName", e)}
                className="w-full h-full rounded-2xl px-[20px] outline-none border-none text-[15px] bg-transparent"
              />
            </div>
            {errors.userName && (
              <p className="text-red-500 text-[13px] ml-2">{errors.userName}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-[85%] flex flex-col gap-1">
            <div
              className={`relative flex items-center justify-start h-[55px] rounded-2xl border-2 transition-all duration-300 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-400 hover:border-black"
              }`}
            >
              <label
                htmlFor="password"
                className={`absolute left-[20px] px-[5px] bg-white text-[15px] text-gray-700 transition-all duration-300 ${
                  focused.password ? "top-[-12px] text-[13px]" : "top-[15px]"
                }`}
              >
                Enter your Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={(e) => handleBlur("password", e)}
                className="w-full h-full rounded-2xl px-[20px] outline-none border-none text-[15px] bg-transparent"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-[20px] text-gray-600 hover:text-black cursor-pointer transition-all duration-200"
              >
                {showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[13px] ml-2">{errors.password}</p>
            )}
          </div>
          <p onClick={()=> navigate("/forgot-password")} className="w-[85%] text-left px-[10px] text-sm text-gray-500 hover:text-black hover:underline cursor-pointer transition-all duration-200">
            Forgot password?
          </p>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-[70%] h-[50px] mt-[20px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Login
          </button>

          <p className="text-gray-700 text-[15px]">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-black font-semibold border-b-2 border-black cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Section - Branding */}
        <div className="hidden lg:flex w-[50%] h-full justify-center items-center bg-black flex-col gap-[15px] text-white text-[16px] font-semibold p-5">
          <img className="w-[50%]" src={Logo1} alt="vybe logo" />
          <p className="opacity-80 text-center">
            Welcome back to <span className="text-yellow-400">VYBE</span> — your
            space to connect & vibe!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
