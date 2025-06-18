import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/authContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [step, setStep] = useState("register"); // register or verify
  const [otpInput, setOtpInput] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const ToastId = toast.loading("Loading...")
    const res = await register(credentials);
    toast.dismiss(ToastId)
    if (res.success) {
      toast.success(`OTP has been sent to ${credentials.email}. Please check your email inbox.`);
      setStep("verify");
    } else {
      toast.error(res.error || "Registration failed");
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    const ToastId = toast.loading("Verifying OTP")
    const res = await verifyOTP(credentials.email, otpInput);
    toast.dismiss(ToastId)
    if (res.authToken) {
      toast.success(`Registration successful!`);
      navigate("/");
    } else {
      toast.error(res.error || "OTP verification failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="p-5 rounded shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="text-center mb-4">
          {step === "register" ? "Create a New Account" : "Verify OTP"}
        </h3>

        <form onSubmit={step === "register" ? handleRegister : handleOTPVerify}>
          {step === "register" && (
            <>
              <div className="mb-3">
                <label htmlFor="registerUsername" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="registerUsername"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerEmail" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </>
          )}

          {step === "verify" && (
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">Enter OTP</label>
              <input
                type="text"
                className="form-control"
                id="otp"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter the OTP"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mt-2">
            {step === "register" ? "Register" : "Verify OTP"}
          </button>
        </form>

        {step === "register" && (
          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-primary">Login</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;