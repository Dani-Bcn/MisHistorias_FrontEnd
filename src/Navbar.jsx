import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();
      console.log(res.data.message);
      if (res.data.message !== "no autorizado") {
        setUser(res.data.userFound);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/allbooks");
  };
  console.log(user);

  return (
    <main className="fixed w-screen h-12 bg-slate-800 items-center backdrop-blur-[5px] flex z-[100] text-white justify-around">
      {isAuthenticated ? (
        <>
          <button onClick={() => navigate("/allbooks")}>Libros</button>
          <img
            onClick={() => navigate("/profile")}
            src={user.imageUserUrl}
            alt=""
            className="w-10 h-10 rounded-[100%] border-2 border-orange-400 cursor-pointer"
          />
          <button onClick={handleLogout} className="text-2xl">
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")} className="text-2xl">
            Iniciar sesión
          </button>
          <button onClick={() => navigate("/register")} className="text-2xl">
            Registrarse
          </button>
        </>
      )}
    </main>
  );
}
