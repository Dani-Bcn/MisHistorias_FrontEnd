import React, { useEffect, useState } from "react";
import { loginUser, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function LoginUser() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [response, setResponse] = useState();

  const verifyUser = async () => {
    window.scrollTo(0, 0);
    const isMatch = await profile();
  };

  useEffect(() => {
    verifyUser();
  },[]);


  return (
    <main className=" overflow-hidden relative w-screen h-[100vh]  text-white  flex justify-start  items-center flex-col">
      <div className="absolute w-[900px] h-[900px] rounded-full  bg-blue-600/5 -mt-[400px] -ml-[1200px]  blur-xl"></div>
      <div className="absolute w-[900px] h-[900px] rounded-full  bg-red-600/10 mt-[400px] ml-[1200px]  blur-xl"></div>
      <div className="absolute w-[350px] h-[450px] mt-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>
      <form
        className=" backdrop-blur-100 mt-40 z-[50] flex flex-col justify-around items-center rounded-xl  transition-all "
        onSubmit={handleSubmit(async (values) => {
          const res = await loginUser(values);
          setResponse(res.data);

          if (res.data.message && res.data.message == "Contraseña no valida") {
            setErrorPassword(true);
            setErrorEmail(false);
          } else if (res.data.message) {
            setErrorEmail(true);
            setErrorPassword(false);
          } else {
            navigate("/profile"), location.reload();
          }
        })}
      >
        <section className=" flex flex-col items-center justify-around gap-20">
        <h2 className="text-5xl">
          <span>A</span>cceder
        </h2>
        <div className="flex flex-col gap-10 justify-between text-xl ">
         
          <input 
            className=" bg-black/0 border-2 border-orange-400"
          type="email" {...register("email", { required: true })}
          placeholder="Correo electrónico"
          />
         
          <input
            className="bg-black/0 border-2 border-orange-400"
            type="password"
            {...register("password", { required: true })}
            placeholder="Contraseña"
          />
        </div>
        

        <button className="btn text-2xl" type="submit">
          <span>E</span>nviar
        </button>
        </section>
        <section className="h-40 flex flex-col items-center gap-3">
          {errorPassword ? (
            <div className="h-10 flex flex-col justify-around items-center gap-2 text-xl text-red-500 ">
              <p>{response.message}</p>
              <button className="btn">Olvidaste tu contraseña?</button>
            </div>
          ) : null}
          {errorEmail ? (
            <div className="text-red-500 h-20  text-xl flex flex-col items-center justify-around gap-2">
              <p>{response.message}</p>
              <button onClick={() => navigate("/register")} className="btn">
                No tienes cuenta?
              </button>             
            </div>
          ) : null}
        </section>
      </form>
    </main>
  );
}
