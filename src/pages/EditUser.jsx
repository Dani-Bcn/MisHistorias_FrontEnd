import React, { useEffect, useState } from "react";
import { profile } from "../api/auth";

export default function EditUser() {
  const [user, setUser] = useState();

  const getUser = async () => {
    window.scrollTo(0, 0);
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
    res.data.message === "No autorizado" ? navigate("/") : null;
  };

  useEffect(() => {
    getUser();
  }, []);

  user ? console.log(user) : null;

  return (
    <main className="w-screen h-96 mt-20 items-center flex">
      {user ? (
        <section className="w-full flex flex-col gap-5 justify-center items-center text-white text-3xl">
          <img className="rounded-full border-8 border-orange-400 " src={user.imageUserUrl} alt="image_user" />
          <h2 className="text-5xl"><span>{user.userName[0]}</span>{user.userName.slice(1)}</h2>
          <h3 className="text-5xl"><span>{user.lastName[0]}</span>{user.lastName.slice(1)}</h3>
          <h4>Miembro desde</h4>
          <p>{user.createdAt.slice(0,10)}</p>
          <h3>Historias</h3>
        </section>
      ) : null}
    </main>
  );
}
