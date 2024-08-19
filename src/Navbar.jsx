import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "./api/auth";
import { profile } from "./api/auth";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const locationPath = useLocation();
  const [user, setUser] = useState();
  const [acces, setAcces] = useState();

  useEffect(() => {
    setAcces(Cookies.get("token"));
  }, [user]);

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <main className="fixed w-screen h-12 bg-slate-600/15  items-center  backdrop-blur-[5px] flex z-[100]">
      <div className=" w-screen  flex justify-center  items-center text-xl text-slate-200">
        {locationPath.pathname !== "/" ? (
          <button className="absolute text-xl" onClick={() => navigate(-1)}>
            <span className="font-bold">V</span>olver
          </button>
        ) : null}
        <ul className="w-[90vw] flex gap-10 justify-end items-center">
          <li onClick={() => navigate("/AllBooks")}>
            <span className="font-bold">T</span>odas las historias
          </li>
          {!acces ? (
            <div className="flex gap-5 items-start justify-center">
              <li onClick={() => navigate("/register")}>
                <span className="font-bold">R</span>egistro
              </li>
              <li onClick={() => navigate("/login")}>
                <span className="font-bold">A</span>cceder
              </li>
            </div>
          ) : (
            <div className="flex gap-5 justify-center items-center">
              {user ? (
                <li>
                  <img
                    onClick={() => navigate("/profile")}
                    src={user.imageUserUrl}
                    alt={user.userName}
                    className=" w-10 h-10  rounded-full border-4 border-white hover:border-orange-600 object-cover transition-all duration-300"
                  />
                </li>
              ) : null}
              <li
                onClick={() => {
                  localStorage.removeItem("token");
                  logout(), navigate("/"),location.reload();
                }}
              >
                Salir
              </li>
            </div>
          )}
        </ul>
      </div>
    </main>
  );
}
