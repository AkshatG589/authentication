import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/auth/authContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { authToken, logout, getUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuth) {
        const res = await getUser();
        if (res && res.user) {
          setUser(res.user);
        }
      }
    };
    fetchUser();
    
  }, [isAuth]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="bg-light d-flex align-items-center justify-content-center vh-100">
      <div
        className="p-4 rounded shadow"
        style={{
          backgroundColor: "rgba(52, 58, 64, 0.6)", // smoky transparent dark background
          color: "white",
          minWidth: "320px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        {!isAuth || !user ? (
          <div className="text-center">
            <h3 className="mb-4">Welcome!</h3>
            <p>Please log in or sign up to continue</p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <a href="/login" className="btn btn-outline-primary">Login</a>
              <a href="/register" className="btn btn-outline-success">Sign Up</a>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center border-bottom pb-3 mb-3">
              <h3 className="mb-0">User Profile</h3>
            </div>

            <div className="text-center">
              <i className="bi bi-person-circle" style={{ fontSize: "4rem" }}></i>
              <h4 className="mt-3">{user.username}</h4>
              <p className="mb-1">Email: {user.email}</p>
              <button className="btn btn-outline-light mt-3" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;