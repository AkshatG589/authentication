import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/authContext";
import toast from "react-hot-toast";

const Forgot = () => {
  const { forgotPassword, verifyResetOtp, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // 'email' | 'otp' | 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter email");
    const ToastId = toast.loading("Sending OTP...")
    const res = await forgotPassword(email);
    toast.dismiss(ToastId)
    if (res.success) {
      //toast.success(`OTP sent to ${email}`);
      toast.success(`Your OTP is: ${res.otp} for ${email}`);
      setStep("otp");
    } else {
      toast.error(res.error || "Something went wrong!");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter OTP");
    const ToastId = toast.loading("verifying OTP")
    const res = await verifyResetOtp(email, otp);
     toast.dismiss(ToastId)
    if (res.success) {
      toast.success("OTP Verified!");
      setStep("reset");
    } else {
      toast.error(res.error || "Invalid OTP");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Enter new password");
    const ToastId = toast.loading("Reseting password")
    const res = await resetPassword(email, newPassword);
    toast.dismiss(ToastId)
    if (res.success) {
      toast.success("Password reset successful!");
      navigate("/login");
    } else {
      toast.error(res.error || "Failed to reset password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="p-5 rounded shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">
          {step === "email"
            ? "Forgot Password"
            : step === "otp"
            ? "Verify OTP"
            : "Reset Password"}
        </h3>

        <form onSubmit={
          step === "email"
            ? handleEmailSubmit
            : step === "otp"
            ? handleOTPSubmit
            : handleResetSubmit
        }>
          {step === "email" && (
            <>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                />
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-muted">OTP sent to <strong>{email}</strong></p>
              <div className="mb-3">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-2">
            {step === "email"
              ? "Send OTP"
              : step === "otp"
              ? "Verify OTP"
              : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-secondary">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Forgot;