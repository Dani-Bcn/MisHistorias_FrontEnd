import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { booksUser, logout, profile } from "./api/auth";
import gsap from "gsap";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cerrarSesion, setCerrarSesion] = useState(false);
  const [desplegable, setDesplegable] = useState(false);

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

  desplegable
    ? gsap.to(".generos", { opacity: 1, display: "flex", duration: 0.5 })
    : gsap.to(".generos", { opacity: 0, display: "none", duration: 0.5 });

  const avisoCerrarSesion = () => {
    return (
      <div className="absolute z-[100] text-2xl  mt-56 w-96 p-5 h-40 bg-indigo-400  text-white flex flex-col justify-around items-center rounded-lg">
        <h3>¿ Ya te vas ?</h3>
        <div className="w-full   flex justify-around">
          <button
            className="hover:text-orange-200"
            onClick={() => {
              handleLogout(), setCerrarSesion(true);
            }}
          >
            Si, decidido!
          </button>
          <button
            className="hover:text-orange-200"
            onClick={() => setCerrarSesion(false)}
          >
            No, aún no!
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="fixed  bg-red-300/0  backdrop-blur-xl z-[100] w-screen h-10 flex items-center  justify-around  text-indigo-400 ">
      <button onClick={() => navigate("/allbooks")}>Libros</button>
      <div className="z-[200]">
        <button
          onMouseOver={() => setDesplegable(true)}
          onMouseOut={() => setDesplegable(false)}
        >
          Géneros
        </button>
        <ul
          onMouseOver={() => setDesplegable(true)}
          onMouseOut={() => setDesplegable(false)}
          className="flex-col opacity-0 generos opacity-1  absolute  text-white  bg-indigo-600/85 p-5 rounded-xl"
        >
          <li>Aventuras</li>
          <li>Acción</li>
          <li>Infantil </li>
          <li>Terror</li>
          <li>Clásico</li>
          <li>Thriller</li>
          <li>Policial</li>
          <li>Romántico</li>
          <li>Comedia</li>
        </ul>
      </div>
      {isAuthenticated ? (
        <>
          <img
            onClick={() => navigate("/profile")}
            src={user.imageUserUrl}
            alt=""
            className="w-10 h-10 object-cover rounded-[100%]  border-2 border-orange-400 cursor-pointer"
          />
          <button
            onClick={() => {
              setCerrarSesion(true);
            }}
          >
            Cerrar sesión
          </button>
          {cerrarSesion ? avisoCerrarSesion() : null}
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button onClick={() => navigate("/register")}>Registrarse</button>
        </>
      )}
    </main>
  );
}
