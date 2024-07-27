import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./api/auth";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();

  const [acces, setAcces] = useState();
  useEffect(() => {
    setAcces(Cookies.get("token"));
  }, []);

  return (
    <main className="fixed w-screen h-20  items-center bg-slate-500/[0] backdrop-blur-50 opacity-[0.9] flex z-[100]">
      <ul 

      className=" w-screen flex justify-center  items-center text-xl text-slate-200">
        <div className="w-[90vw] flex gap-10 justify-end">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/AllBooks")}>Todas las historias</li>

          {!acces ? (
            <div className="flex gap-5">
              <li onClick={() => navigate("/register")}>Registro</li>
              <li onClick={() => navigate("/login")}>Acceder</li>
            </div>
          ) : (
            <div className="flex gap-5">
              <li onClick={() => navigate("/profile")}>Mi Espacio</li>
              <li
                onClick={() => {
                  logout(), navigate("/"), location.reload();
                }}
              >
                Salir
              </li>
            </div>
          )}
        </div>
      </ul>
    </main>
  );
}
