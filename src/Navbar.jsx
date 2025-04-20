import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile, logout } from "./api/auth";
import gsap from "gsap";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const genres = [
    "Aventuras",
    "Acción",
    "Infantil",
    "Terror",
    "Clásico",
    "Thriller",
    "Policial",
    "Romántico",
    "Comedia",
    "Cuentos",
  ];

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

  useEffect(() => {
    gsap.to(".generos", {
      opacity: showGenres ? 1 : 0,
      display: showGenres ? "flex" : "none",
      duration: 0.5,
    });
  }, [showGenres]);

  const handleLogout = async () => {
    await logout();
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/allbooks");
  };

  const handleGenreClick = (e) => {
    localStorage.setItem("genero", e.target.innerText);
    navigate("/allbooks");
    setShowGenres(false);
  };

  const LogoutModal = () => (
    <div className="fixed z-[100] w-10/12 text-2xl mt-56 sm:w-96  h-40 bg-indigo-400/90 text-white flex flex-col justify-around items-center rounded-lg">
      <h3>¿Ya te vas?</h3>
      <div className="w-full flex justify-around">
        <button
          className="border-2 text-xl hover:bg-orange-200 hover:text-slate-400 bg-slate-400 border-orange-200 hover:border-slate-500 rounded-lg px-3 py-1"
          onClick={handleLogout}
        >
          Sí, decidido!
        </button>
        <button
          className="border-2 text-xl hover:bg-orange-200 hover:text-slate-400 bg-slate-400 border-orange-200 hover:border-slate-500 rounded-lg px-3 py-1"
          onClick={() => setShowLogoutModal(false)}
        >
          No, aún no!
        </button>
      </div>
    </div>
  );

  return (
    <main className="fixed bg-red-300/0 backdrop-blur-xl z-[100] w-screen h-16 flex items-center justify-around text-indigo-400">
      <button
        onClick={() => {
          navigate("/allbooks");
          localStorage.setItem("genero", "Libros");
        }}
      >
        Libros
      </button>
      <div className="z-[200]">
        <button
          onMouseOver={() => {
            setShowGenres(true), setShowLogoutModal(false);
          }}
          onMouseOut={() => setShowGenres(false)}
        >
          Géneros
        </button>
        <ul
          onMouseOver={() => {
            setShowGenres(true);
          }}
          onMouseOut={() => setShowGenres(false)}
          className="flex-col gap-2 opacity-0 generos absolute  p-5 rounded-lg"
          onClick={handleGenreClick}
        >
          {genres.map((genre) => (
            <li
              className="border border-indigo-400 py-1 px-3 rounded-[20px] bg-indigo-400 text-white hover:bg-white hover:text-indigo-400"
              key={genre}
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
      {isAuthenticated ? (
        <>
          <img
            onClick={() => navigate("/profile")}
            src={user.imageUserUrl}
            alt="User"
            className="w-10 h-10 object-cover rounded-[100%] border-2 border-orange-400 cursor-pointer"
          />
          <button onClick={() => setShowLogoutModal(true)}>
            Cerrar sesión
          </button>
          {showLogoutModal && <LogoutModal />}
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
