import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar el perfil del usuario al montar el componente
 
    const fetchProfile = async () => {
      try {
        const res = await profile();
        if (res?.data?.userFound) {
          setUser(res.data.userFound);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };

    fetchProfile();
  

  // Manejar logout
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/allBooks");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <main className="fixed w-screen h-12 bg-slate-600/15 items-center backdrop-blur-[5px] flex z-[100]">
      <div className="w-screen flex justify-center items-center text-xl text-slate-200">
        <ul className="w-screen flex justify-center lg:justify-around gap-5 items-center">
          <li onClick={() => navigate("/allBooks")} className="cursor-pointer">
            <span className="font-bold">T</span>odas las historias
          </li>
          {isAuthenticated ? (
            <div className="flex gap-5 justify-center items-center">
              <ul className="flex justify-center items-center gap-x-5">
                <li>
                  {user?.imageUserUrl ? (
                    <img
                      onClick={() => navigate("/profile")}
                      src={user.imageUserUrl}
                      alt={user.userName || "Usuario"}
                      className="w-10 h-10 rounded-full border-4 border-white hover:border-orange-600 object-cover transition-all duration-300 cursor-pointer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user?.userName?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}
                </li>
                <li
                  onClick={handleLogout}
                  className="cursor-pointer hover:text-orange-600 transition-all"
                >
                  Logout
                </li>
              </ul>
            </div>
          ) : (
            <ul className="flex gap-5 items-start justify-center">
              <li
                onClick={() => navigate("/register")}
                className="cursor-pointer hover:text-orange-600 transition-all"
              >
                <span className="font-bold">R</span>egistro
              </li>
              <li
                onClick={() => navigate("/login")}
                className="cursor-pointer hover:text-orange-600 transition-all"
              >
                <span className="font-bold">A</span>cceder
              </li>
            </ul>
          )}
        </ul>
      </div>
    </main>
  );
}
