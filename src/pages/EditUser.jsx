import React, { useEffect, useState } from "react";
import { editUser, profile } from "../api/auth";
import imageEdit from "/public/images/editar-lapiz.png";
import { uploadImg } from "../api/auth";

export default function EditUser() {

  const [user, setUser] = useState();
  const [activeEditName, setActiveEditName] = useState(false);
  const [activeEditLastName, setActiveEditLastName] = useState(false);
  const [activeEditEmail, setActiveEditEmail] = useState(false);
  const [name, setName] = useState();
  const [lastName, setlastName] = useState();
  const [email, setEmail] = useState();
  const [emptyFields, setEmptyFields] = useState(false);
  const [messageError, setMessageError] = useState();
  const [imageUrl,setImageUrl] = useState()

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  useEffect(() => {
    getUser();
  }, []);

  const nameSaved = async (e) => {
    if (e.target.form[0].value === "") {
      e.preventDefault();
      setEmptyFields(true);
    } else {
      console.log(e.target.form[0].value);
      e.preventDefault();
      setName(e.target.form[0].value);
      const values = {
        userName: e.target.form[0].value,
      };
      const res = await editUser(user._id, values);
      setActiveEditName(false);
    }
  };

  const lastNameSaved = async (e) => {
    if (e.target.form[0].value === "") {
      e.preventDefault();
      setEmptyFields(true);
    } else {
      e.preventDefault();
      setlastName(e.target.form[0].value);

      const values = {
        lastName: e.target.form[0].value,
      };
      const isMatch = getUser();
      const res = await editUser(user._id, values);
      setActiveEditLastName(false);
    }
  };

  const emailSaved = async (e) => {
    if (e.target.form[0].value === "") {
      e.preventDefault();
      setEmptyFields(true);
    } else {
      e.preventDefault();
      setEmail(e.target.form[0].value);
      setActiveEditEmail(false);
      const values = {
        email: e.target.form[0].value,
      };
      const res = await editUser(user._id, values);

      if (typeof res.data === "string") {
        setMessageError(res.data);
      } else {
        setMessageError("");
      }
      setActiveEditEmail(false);
    }
  };
  
  return (
    <main className="w-screen  h-screen flex justify-center items-center overflow-x-hidden">
      {user ? (
        <section className="w-[95vw] h-[95vh] m-auto gap-10 flex flex-col justify-start items-center mt-40 ">
          <img
            src={user.imageUserUrl}
            alt=""
            width={250}
            className="rounded-full border-8 border-orange-400"
          />
         
          <form className=" w-10/12 flex justify-center">
            <div className=" w-1/2 text-3xl p-10 bg-slate-500 flex flex-col gap-5 justify-between">
              <h4>Nombre</h4>
              {activeEditName ? (
                <div className="flex gap-2">
                  <input placeholder="Nombre" />
                  <button
                    onClick={(e) => nameSaved(e)}
                    className="w-10 h-10 bg-slate-700 text-green-500 rounded-md"
                  >
                    V
                  </button>
                  <button
                    onClick={() => setActiveEditName(false)}
                    className="w-10 h-10 bg-slate-700  text-red-400 rounded-md"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className="flex gap-5 text-orange-400">
                  {name ? <h4>{name}</h4> : <h4>{user.userName}</h4>}
                  <img
                    onClick={() => setActiveEditName(true)}
                    className="w-7 h-7 brightness-200 cursor-pointer"
                    src={imageEdit}
                    alt=""
                  />
                </div>
              )}
              <h4>Apellido</h4>
              {activeEditLastName ? (
                <div className="flex gap-2">
                  <input placeholder="Apellido" />
                  <button
                    onClick={(e) => lastNameSaved(e)}
                    className="w-10 h-10 bg-slate-700 rounded-md text-green-500"
                  >
                    V
                  </button>
                  <button
                    onClick={() => setActiveEditLastName(false)}
                    className="w-10 h-10 bg-slate-700 rounded-md text-red-400"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className="flex gap-5 text-orange-400">
                  {lastName ? <h4>{lastName}</h4> : <h4>{user.lastName}</h4>}
                  <img
                    onClick={() => setActiveEditLastName(true)}
                    className="w-7 h-7 brightness-200 cursor-pointer"
                    src={imageEdit}
                    alt=""
                  />
                </div>
              )}
              <h4>Correo electrónico</h4>
              {activeEditEmail ? (
                <div className="flex gap-2">
                  <input placeholder="Email" />
                  <button
                    onClick={(e) => emailSaved(e)}
                    className="w-10 h-10 bg-slate-700 rounded-md text-green-500"
                  >
                    V
                  </button>
                  <button
                    onClick={() => setActiveEditEmail(false)}
                    className="w-10 h-10 bg-slate-700 rounded-md text-red-400"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className="flex gap-5 text-orange-400">
                  {email && typeof(messageError)  !== "string"? <h4>{email}</h4> : <h4>{user.email}</h4>}
                  <img
                    onClick={() => setActiveEditEmail(true)}
                    className="w-7 h-7 brightness-200 cursor-pointer"
                    src={imageEdit}
                    alt=""
                  />
                </div>
              )}
              {messageError ? (
                <h4 className="font-bold text-red-400">{messageError}</h4>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}
    </main>
  );
}
