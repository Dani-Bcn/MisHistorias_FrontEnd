import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./api/auth";
import { profile } from "./api/auth";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [acces, setAcces] = useState();

  useEffect(() => {
    setAcces(Cookies.get("token"));
  }, []);

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className="fixed w-screen h-12 bg-slate-600/15  items-center  backdrop-blur-[5px] flex z-[100]">
      <ul className=" w-screen flex justify-center  items-center text-xl text-slate-200">
        <div className="w-[90vw] flex gap-10 justify-end items-center">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/AllBooks")}>Todas las historias</li>
          {!acces ? (
            <div className="flex gap-5 items-start justify-center">
              <li onClick={() => navigate("/register")}>Registro</li>
              <li onClick={() => navigate("/login")}>Acceder</li>
            </div>
          ) : (
            <div className="flex gap-5 justify-center items-center">
              {user ? (
                <li>
                  <img
                    onClick={() => navigate("/profile")}
                    src={user.imageUserUrl}
                    alt={user.userName}
                    className=" w-10 h-10  rounded-full border-4 border-white hover:border-orange-400 object-cover transition-all duration-300"
                  />
                </li>
              ) : null}
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
