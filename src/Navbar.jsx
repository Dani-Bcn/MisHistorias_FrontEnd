import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 
   
  const token = Cookies.get("token");


  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();
      if (res) setUser(res.data.userFound);
    };
    if (token) {
      setIsAuthenticated(true);
      fetchUser();
    }
  }, [token]);

  const handleLogout = async () => {
    const res = await logout();
    console.log(res.data);
    navigate("/allBooks");
    setIsAuthenticated(false);
  };
  console.log(isAuthenticated);

  return (
    <main className="fixed w-screen h-12 bg-slate-800 items-center backdrop-blur-[5px] flex z-[100] text-white justify-around">
      <button
        onClick={() => {
          navigate("/allBooks");
        }}
      >
        All books
      </button>
      {isAuthenticated ? (
        <section >
          <button
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </section>
      ) : (
        <section className="flex justify-around w-60">
          <button
            onClick={() => {
              navigate("/register");
            }}
          >
            Registrase
          </button>
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Acceder
          </button>
        </section>
      )}
    </main>
  );
}
