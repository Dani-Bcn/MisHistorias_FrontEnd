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
    <div className="fixed left-1/2 top-24 z-[120] w-[90vw] max-w-sm -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-950/95 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <h3 className="text-center text-2xl font-bold">¿Ya te vas?</h3>
      <div className="mt-6 flex w-full justify-center gap-3">
        <button
          className="btn-danger"
          onClick={handleLogout}
        >
          Sí, decidido!
        </button>
        <button
          className="btn-secondary"
          onClick={() => setShowLogoutModal(false)}
        >
          No, aún no!
        </button>
      </div>
    </div>
  );

  return (
    <main className="fixed left-1/2 top-3 z-[100] flex w-[calc(100%-1rem)] max-w-6xl -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-950/80 px-2 py-2 text-xs text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-xl sm:top-4 sm:w-[calc(100%-1.5rem)] sm:justify-between sm:rounded-full sm:px-6 sm:text-base">
      <button
        className="btn-secondary px-3 py-1.5"
        onClick={() => {
          navigate("/allbooks");
          localStorage.setItem("genero", "Libros");
        }}
      >
        Libros
      </button>
      <div className="z-[200]">
        <button
          className="rounded-full px-3 py-2 font-semibold text-indigo-100 hover:bg-white/10 hover:text-orange-200"
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
          className="generos absolute left-1/2 mt-3 hidden max-h-[70vh] min-w-44 -translate-x-1/2 flex-col gap-2 overflow-auto rounded-3xl border border-white/10 bg-slate-950/95 p-4 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl sm:left-auto sm:translate-x-0"
          onClick={handleGenreClick}
        >
          {genres.map((genre) => (
            <li
              className="rounded-full border border-indigo-300/40 bg-indigo-500/15 px-4 py-2 text-sm text-indigo-50 hover:border-orange-300 hover:bg-orange-400/15 hover:text-orange-200"
              key={genre}
            >
              {genre}
            </li>
          ))}
        </ul>
     {/*    <button
        onClick={() => navigate("/sendMail")}
        >Send Mail</button> */}
      </div>
      {isAuthenticated ? (
        <>
          <img
            onClick={() => navigate("/profile")}
            src={user.imageUserUrl}
            alt="User"
            className="h-10 w-10 cursor-pointer rounded-full border-2 border-orange-300 object-cover shadow-lg shadow-orange-500/20 sm:h-11 sm:w-11"
          />
          <button className="hidden font-semibold text-slate-200 hover:text-orange-200 sm:block" onClick={() => setShowLogoutModal(true)}>
            Cerrar sesión
          </button>
          {showLogoutModal && <LogoutModal />}
        </>
      ) : (
        <>
          <button className="rounded-full px-2 py-1 font-semibold text-slate-200 hover:bg-white/10 hover:text-orange-200 sm:px-3" onClick={() => navigate("/login")}>Iniciar sesión</button>
          <button className="btn-primary px-3 py-1.5" onClick={() => navigate("/register")}>Registrarse</button>
        </>
      )}
    </main>
  );
}
