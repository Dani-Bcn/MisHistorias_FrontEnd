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

  desplegable?gsap.to(".generos", {  opacity: 1, display:"flex",  duration: 0.5 }):gsap.to(".generos", { opacity: 0,display:"none",duration: 0.5 })
 
    
  
  

  const avisoCerrarSesion = () => {
    return (
      <div className="absolute text-2xl mt-56 w-72 h-32 bg-red-400 flex flex-col justify-around items-center rounded-2xl">
        <h3>¿ Ya te vas ?</h3>
        <div className="w-full  text-2xl flex justify-around">
          <button
            onClick={() => {
              handleLogout(), setCerrarSesion(false);
            }}
          >
            Si, decidido!
          </button>
          <button onClick={() => setCerrarSesion(false)}>No, aún no!</button>
        </div>
      </div>
    );
  };

  return (
    <main className="fixed w-screen flex items-center justify-center backdrop-blur-[5px] z-[100] bg-red-200/0">
    <section className=" w-full h-8 lg:mt-5 mt-2 grid grid-cols-4 items-center   text-indigo-700 justify-around  text-sm lg:text-2xl lg:h-14 ">
      <button  onClick={() => navigate("/allbooks")}>
        Libros
      </button>
      <div className="  w-40  h-24 flex-col row-span-2  ">
        <button
       
          onMouseOver={() => setDesplegable(true)}
          onMouseOut={() => setDesplegable(false)}
        >
          Géneros
        </button>
        <ul
          onMouseOver={() => setDesplegable(true)}
          onMouseOut={() => setDesplegable(false)}
          className="flex-col opacity-0 generos opacity-1   text-white  bg-indigo-600/85 p-5 rounded-xl"
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
            className="w-10 h-10 object-cover rounded-[100%] border-2 border-orange-400 cursor-pointer"
          />
          <button
            onClick={() => {
              setCerrarSesion(true);
            }}
            className="text-xl"
          >
            Cerrar sesión
          </button>
          {cerrarSesion ? avisoCerrarSesion() : null}
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")} >
            Iniciar sesión
          </button>
          <button onClick={() => navigate("/register")} >
            Registrarse
          </button>
        </>
      )}
    </section>
    </main>
  );
}
