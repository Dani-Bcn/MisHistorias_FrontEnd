import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [state, setState] = useState(false);
  const cookie = Cookies.get();
  const [screen, setScreen] = useState(window.screen);
  const [stateMobile, setStateMobile] = useState();

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
    setState(!state);
  };

  useEffect(() => {
    getUser();    
    screen.width < 950 ? setStateMobile(false) : setStateMobile(true)
  }, []);
 
  window.addEventListener("resize", ()=> screen.width < 950 ? setStateMobile(false) : setStateMobile(true));
  return (
    <main className="fixed w-screen h-12 bg-slate-600/15  items-center  backdrop-blur-[5px] flex z-[100]">
      <div className=" w-screen  flex justify-center  items-center text-xl text-slate-200">
        <ul className="w-[90vw] flex gap-10 justify-end items-center">
          <li onClick={() => navigate("/allBooks")}>
            <span className="font-bold">T</span>odas las historias
          </li>
          {stateMobile?
          !user ? (
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
                <ul className="flex justify-center items-center gap-x-5">
                  <li>
                    <img
                      onClick={() => navigate("/profile")}
                      src={user.imageUserUrl}
                      alt={user.userName}
                      className=" w-10 h-10  rounded-full border-4 border-white hover:border-orange-600 object-cover transition-all duration-300"
                    />
                  </li>
                  <li
                    onClick={() => {
                      logout(),
                        setState(!state),
                        setTimeout(() => {
                          navigate("/allBooks");
                          location.reload();
                          localStorage.setItem("token", "");
                        }, 150);
                    }}
                  >
                    Logout
                  </li>
                </ul>
              ) : null}
            </div>
          )
          :null}
        </ul>
      </div>
    </main>
  );
}
