import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";
import gsap from "gsap";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();

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
  const [desplegable, setDesplegable] = useState(false);
  const desplegarGeneros = () => {
    setDesplegable(!desplegable);
    !desplegable
      ? gsap.to(".generos", { y: 100, opacity: 1, duration: 1 })
      : gsap.to(".generos", { y: 0, opacity: 0, duration: 1 });
  };
  console.log(desplegable);
  return (
    <main className="fixed w-screen h-12 bg-slate-800 items-center backdrop-blur-[5px] flex z-[100] text-white justify-around">
      {isAuthenticated ? (
        <>
          <button onClick={() => navigate("/allbooks")}>Libros</button>
          <div className="h-8">
            <button onClick={() => desplegarGeneros()}>Géneros</button>
            <ul onClick={() => desplegarGeneros()} className="generos opacity-0 -mt-20 bg-indigo-600 p-2 rounded-xl">
              <li>Aventuras</li>
              <li>acción</li>
              <li>Infantil </li>
              <li>Terror</li>
              <li>Clásico</li>
              <li>Thriller</li>
              <li>Policial</li>
              <li>Romántico</li>
              <li>Comedia</li>
            </ul>
          </div>
          <img
            onClick={() => navigate("/profile")}
            src={user.imageUserUrl}
            alt=""
            className="w-10 h-10 object-cover rounded-[100%] border-2 border-orange-400 cursor-pointer"
          />
          <button onClick={handleLogout} className="text-2xl">
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/allbooks")}>Libros</button>
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
