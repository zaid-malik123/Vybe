import { useState } from "react";
import Logo from "../assets/logo2.png";
import Logo1 from "../assets/logo.png";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()  
  const [focused, setFocused] = useState({
    userName: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field, e) => {
    if (!e.target.value) setFocused({ ...focused, [field]: false });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center px-3">
      <div className="w-[95%] lg:max-w-[60%] bg-white rounded-2xl flex justify-center items-center overflow-hidden border border-gray-300 shadow-2xl">
        {/* Left Section - Form */}
        <div className="w-full lg:w-[50%] h-full flex flex-col items-center py-[40px] gap-[25px]">
          <div className="flex gap-2 items-center text-[22px] font-semibold mt-[10px]">
            <span>Login to</span>
            <img className="w-[80px]" src={Logo} alt="logo" />
          </div>

          {/* Username */}
          <div className="relative flex items-center justify-start w-[85%] h-[55px] rounded-2xl border-2 border-gray-400 hover:border-black transition-all duration-300">
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
              onFocus={() => handleFocus("userName")}
              onBlur={(e) => handleBlur("userName", e)}
              className="w-full h-full rounded-2xl px-[20px] outline-none border-none text-[15px] bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center justify-start w-[85%] h-[55px] rounded-2xl border-2 border-gray-400 hover:border-black transition-all duration-300">
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

          {/* Button */}
          <button className="w-[70%] h-[50px] mt-[20px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-xl">
            Login
          </button>

          <p className="text-gray-700 text-[15px]">
            Don’t have an account?{" "}
            <span onClick={()=> navigate("/signup")} className="text-black font-semibold border-b-2 border-black cursor-pointer">
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Section - Branding */}
        <div className="hidden lg:flex w-[50%] h-full justify-center items-center bg-black flex-col gap-[15px] text-white text-[16px] font-semibold p-5">
          <img className="w-[50%]" src={Logo1} alt="vybe logo" />
          <p className="opacity-80 text-center">
            Welcome back to <span className="text-yellow-400">VYBE</span> — your space to connect & vibe!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
