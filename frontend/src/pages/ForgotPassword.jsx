import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });
  const [focused, setFocused] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
  });

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field, e) => {
    if (!e.target.value) setFocused({ ...focused, [field]: false });
  };

  // handle OTP input
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    // move to next box automatically
    if (value && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  // submit handlers
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (formData.otp.some((d) => d === "")) {
      alert("Please enter the full 4-digit OTP.");
      return;
    }
    setStep(3);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successful!");
    navigate("/login");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center px-3 relative">
      {/* BACK TO LOGIN BUTTON */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-gray-300 transition-all duration-300"
      >
        <LuArrowLeft size={22} />
        <span className="font-medium">Back</span>
      </button>

      {/* STEP 1: Email */}
      {step === 1 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex flex-col items-center justify-center border border-[#1a1f23] shadow-2xl">
          <h2 className="text-[30px] font-semibold mb-6">Forgot Password</h2>

          <form
            onSubmit={handleEmailSubmit}
            className="w-[85%] flex flex-col gap-6 items-center"
          >
            <div className="w-full flex flex-col gap-1">
              <div
                className={`relative flex items-center justify-start h-[55px] rounded-2xl border-2 transition-all duration-300 border-gray-400 hover:border-black`}
              >
                <label
                  htmlFor="email"
                  className={`absolute left-[20px] px-[5px] bg-white text-[15px] text-gray-700 transition-all duration-300 ${
                    focused.email ? "top-[-12px] text-[13px]" : "top-[15px]"
                  }`}
                >
                  Enter your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={(e) => handleBlur("email", e)}
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-none text-[15px] bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-[60%] h-[50px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Send OTP
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex flex-col items-center justify-center border border-[#1a1f23] shadow-2xl">
          <h2 className="text-[28px] font-semibold mb-4">Verify OTP</h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Enter the 4-digit OTP sent to your email
          </p>

          <form
            onSubmit={handleOtpSubmit}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex gap-4">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-[55px] h-[55px] text-center text-[22px] font-semibold border-2 border-gray-400 rounded-xl focus:border-black outline-none transition-all duration-300"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-[60%] h-[50px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Verify OTP
            </button>

            <p
              onClick={() => setStep(1)}
              className="text-gray-600 text-sm cursor-pointer hover:text-black underline"
            >
              Change Email
            </p>
          </form>
        </div>
      )}

      {/* STEP 3: New Password */}
      {step === 3 && (
        <div className="w-[90%] max-w-[500px] h-[520px] bg-white rounded-2xl flex flex-col items-center justify-center border border-[#1a1f23] shadow-2xl">
          <h2 className="text-[28px] font-semibold mb-6">Reset Password</h2>

          <form
            onSubmit={handlePasswordSubmit}
            className="w-[85%] flex flex-col gap-5 items-center"
          >
            {/* New Password */}
            <div className="w-full flex flex-col gap-1">
              <div className="relative flex items-center h-[55px] rounded-2xl border-2 transition-all duration-300 border-gray-400 hover:border-black">
                <label
                  htmlFor="newPassword"
                  className={`absolute left-[20px] px-[5px] bg-white text-[15px] text-gray-700 transition-all duration-300 ${
                    focused.newPassword
                      ? "top-[-12px] text-[13px]"
                      : "top-[15px]"
                  }`}
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("newPassword")}
                  onBlur={(e) => handleBlur("newPassword", e)}
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-none text-[15px] bg-transparent"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="w-full flex flex-col gap-1">
              <div className="relative flex items-center h-[55px] rounded-2xl border-2 transition-all duration-300 border-gray-400 hover:border-black">
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-[20px] px-[5px] bg-white text-[15px] text-gray-700 transition-all duration-300 ${
                    focused.confirmPassword
                      ? "top-[-12px] text-[13px]"
                      : "top-[15px]"
                  }`}
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={(e) => handleBlur("confirmPassword", e)}
                  className="w-full h-full rounded-2xl px-[20px] outline-none border-none text-[15px] bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-[60%] h-[50px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
