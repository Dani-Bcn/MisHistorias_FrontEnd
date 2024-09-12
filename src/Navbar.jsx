import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, profile } from "./api/auth";
import Cookies from "js-cookie";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [state, setState] = useState(false);
  const cookie = Cookies.get();
  
  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
    setState(!state);
  };

  useEffect(() => {
    getUser();
  }, [state]);
  return (
    <main className="fixed w-screen h-12 bg-slate-600/15 items-center backdrop-blur-[5px] flex z-[100]">
      <div className=" w-screen  flex justify-center  items-center text-xl text-slate-200 ">
        <ul className="w-screen flex  justify-center lg:justify-around gap-5 items-center">
          <li onClick={() => navigate("/allBooks")}>
            <span className="font-bold">T</span>odas las historias
          </li>
          {!user ? (
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
                     logout(),setState(!state),
                     
                     setTimeout(() => {
                      navigate("/allBooks") 
setState(!state)
                     }, 150);
                     

                    }}
                  >
                    Logout
                  </li>
                </ul>
              ) : null}
            </div>
          )}
        </ul>
      </div>
    </main>
  );
}
