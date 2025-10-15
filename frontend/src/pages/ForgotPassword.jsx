import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  // Validation functions
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const validatePassword = (password) =>
    password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  // Generic input handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" }); // clear error on change
  };

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field, e) => {
    if (!e.target.value) setFocused({ ...focused, [field]: false });
  };

  // OTP input logic
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
    setErrors({ ...errors, otp: "" });

    if (value && index < 3) otpRefs[index + 1].current.focus();
    if (!value && index > 0) otpRefs[index - 1].current.focus();
  };

  // Step 1: Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;

    if (!email.trim()) return setErrors({ email: "Email is required" });
    if (!validateEmail(email)) return setErrors({ email: "Invalid email format" });

    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/user/send-otp`, { email });
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (formData.otp.some((d) => d === ""))
      return setErrors({ otp: "Please enter all 4 digits" });

    try {
      setLoading(true);
      const otpString = formData.otp.join("");
      await axios.post(`${serverUrl}/api/user/verify-otp`, {
        email: formData.email,
        otp: otpString,
      });
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || "OTP verification failed";
      setErrors({ otp: msg });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword, email } = formData;

    if (!newPassword.trim())
      return setErrors({ newPassword: "New password is required" });
    if (!validatePassword(newPassword))
      return setErrors({
        newPassword:
          "Password must be at least 6 characters, include one uppercase and one number",
      });
    if (confirmPassword !== newPassword)
      return setErrors({ confirmPassword: "Passwords do not match" });

    try {
      setLoading(true);
      await axios.post(`${serverUrl}/api/user/reset-password`, {
        email,
        password: newPassword,
      });
      navigate("/login");
      toast.success("Password reset Successfully")
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed";
      setErrors({ newPassword: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center px-3 relative">
      {/* Back Button */}
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
                className={`relative flex items-center justify-start h-[55px] rounded-2xl border-2 transition-all duration-300 ${
                  errors.email ? "border-red-500" : "border-gray-400 hover:border-black"
                }`}
              >
                <label
                  htmlFor="email"
                  className={`absolute left-[20px] px-[5px] bg-white text-[15px] transition-all duration-300 ${
                    focused.email ? "top-[-12px] text-[13px]" : "top-[15px]"
                  } ${errors.email ? "text-red-500" : "text-gray-700"}`}
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-[60%] h-[50px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex justify-center items-center"
            >
              {loading ? <ClipLoader size={22} color="white" /> : "Send OTP"}
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
                  className={`w-[55px] h-[55px] text-center text-[22px] font-semibold border-2 rounded-xl focus:border-black outline-none transition-all duration-300 ${
                    errors.otp ? "border-red-500" : "border-gray-400"
                  }`}
                />
              ))}
            </div>
            {errors.otp && <p className="text-red-500 text-sm mt-[-10px]">{errors.otp}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-[60%] h-[50px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex justify-center items-center"
            >
              {loading ? <ClipLoader size={22} color="white" /> : "Verify OTP"}
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

      {/* STEP 3: Reset Password */}
      {step === 3 && (
        <div className="w-[90%] max-w-[500px] h-[520px] bg-white rounded-2xl flex flex-col items-center justify-center border border-[#1a1f23] shadow-2xl">
          <h2 className="text-[28px] font-semibold mb-6">Reset Password</h2>
          <form
            onSubmit={handlePasswordSubmit}
            className="w-[85%] flex flex-col gap-5 items-center"
          >
            {/* New Password */}
            <div className="w-full flex flex-col gap-1">
              <div
                className={`relative flex items-center h-[55px] rounded-2xl border-2 transition-all duration-300 ${
                  errors.newPassword
                    ? "border-red-500"
                    : "border-gray-400 hover:border-black"
                }`}
              >
                <label
                  htmlFor="newPassword"
                  className={`absolute left-[20px] px-[5px] bg-white text-[15px] transition-all duration-300 ${
                    focused.newPassword ? "top-[-12px] text-[13px]" : "top-[15px]"
                  } ${errors.newPassword ? "text-red-500" : "text-gray-700"}`}
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
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="w-full flex flex-col gap-1">
              <div
                className={`relative flex items-center h-[55px] rounded-2xl border-2 transition-all duration-300 ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-400 hover:border-black"
                }`}
              >
                <label
                  htmlFor="confirmPassword"
                  className={`absolute left-[20px] px-[5px] bg-white text-[15px] transition-all duration-300 ${
                    focused.confirmPassword ? "top-[-12px] text-[13px]" : "top-[15px]"
                  } ${errors.confirmPassword ? "text-red-500" : "text-gray-700"}`}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-[60%] h-[50px] bg-black text-white font-semibold rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex justify-center items-center"
            >
              {loading ? <ClipLoader size={22} color="white" /> : "Reset Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
