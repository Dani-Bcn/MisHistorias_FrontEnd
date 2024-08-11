import React, { useEffect, useState } from "react";
import { editUser, profile } from "../api/auth";
import imageEdit from "/public/images/editar-lapiz.png";
import { uploadImg } from "../api/auth";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()

  const getUser = async () => {
    window.scrollTo(0, 0);
    const res = await profile();
    res ? setUser(res.data.userFound) :  null;
    res.data.message === "No autorizado"?navigate("/") :null
  };

  useEffect(() => {
   
    getUser();
  }, []);

  const nameSaved = async (e) => {
    if (e.target.form[0].value === "") {
      e.preventDefault();
      setEmptyFields(true);
    } else {
     
      e.preventDefault();
      setName(e.target.form[0].value);
      const values = {
        userName: e.target.form[0].value,
      };
       await editUser(user._id, values);
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
    <main className="w-[85vw] h-96 m-20 items-center flex">
      {user ? (
        <section className="w-full flex justify-around text-white">
          <img
            src={user.imageUserUrl}
            alt="img-user"
            className="w-72 h-72 object-cover object-top rounded-full"
          />
          <form className="w-1/2 flex flex-col justify-around">          
              <div className="w-10/12 flex  text-2xl gap-5">
                <h4 className="w-60">Nombre</h4>              
                {activeEditName ? (
                  <div className="flex gap-5">
                    <input placeholder="Nombre" />
                    <button 
                    className="text-green-500"
                    onClick={(e) => nameSaved(e)} ko>
                      V
                    </button>
                    <button 
                    className="text-red-500"
                    onClick={() => setActiveEditName(false)}>X</button>
                  </div>
                ) : (
                  <div className="flex gap-5">
                    {name ? <h4>{name}</h4> : <h4>{user.userName}</h4>}
                    <img
                      onClick={() => setActiveEditName(true)}
                      src={imageEdit}
                      alt="img-pencil"
                      className="w-7 h-7 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <div className="w-10/12 flex  text-2xl gap-5">
                <h4 className="w-60">Apellido</h4>
                {activeEditLastName ? (
                  <div className="flex gap-5">
                    <input placeholder="Apellido" />
                    <button className="text-green-500" onClick={(e) => lastNameSaved(e)}>V</button>
                    <button className="text-red-500" onClick={() => setActiveEditLastName(false)}>
                      X
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-5">
                    {lastName ? <h4>{lastName}</h4> : <h4>{user.lastName}</h4>}
                    <img
                      onClick={() => setActiveEditLastName(true)}
                      src={imageEdit}
                      alt="img-pencil"
                      className="w-7 h-7 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <div className="w-10/12 flex text-2xl" >
                <h4 className="w-64">Correo electrónico</h4>
                {activeEditEmail ? (
                  <div className="flex gap-5"> 
                    <input placeholder="Email"  type="email" />
                    <button type="submit" className="text-green-500" onClick={(e) => {emailSaved(e)} }>V</button>
                    <button  className="text-red-500" onClick={() => setActiveEditEmail(false)}>X</button>
                  </div>
                ) : (
                  <div className="flex gap-5">
                    {email && typeof messageError !== "string" ? (
                      <h4 className="w-96">{email}</h4>
                    ) : (
                      <h4>{user.email}</h4>
                    )}
                    <img
                      onClick={() => setActiveEditEmail(true)}
                      src={imageEdit}
                      alt="img-pencil"
                      className="w-7 h-7 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              {messageError ? <h4>{messageError}</h4> : null}
          
          </form>
        </section>
      ) : null}
    </main>
  );
}
