import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();
      if (res) {
        setUser(res.data.userFound);
        setIsAuthenticated(true);
      }
     
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/allbooks");
  };



  return (
    <main className="fixed w-screen h-12 bg-slate-800 items-center backdrop-blur-[5px] flex z-[100] text-white justify-around">
      {
        isAuthenticated ? ( 
          <>
            <h1 className="text-2xl">Hola, {user?.name}</h1>
            <button onClick={handleLogout} className="text-2xl">Cerrar sesión</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="text-2xl">Iniciar sesión</button>
            <button onClick={() => navigate("/register")} className="text-2xl">Registrarse</button>
          </>
        )
      }
      
    </main>
  );
}
