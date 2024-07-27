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

    isMatch.data.message !== "No autorizado" ? navigate("/") : null;
  };
  useEffect(() => {
    verifyUser();
  });

  return (
    <main className=" overflow-hidden relative w-screen  text-white  flex justify-start  items-center flex-col">
      <div className="absolute w-[900px] h-[900px] rounded-full  bg-blue-600/5 -mt-[400px] -ml-[1200px]  blur-xl"></div>
      <div className="absolute w-[900px] h-[900px] rounded-full  bg-red-600/10 mt-[400px] ml-[1200px]  blur-xl"></div>
      <div className="absolute w-[350px] h-[450px] mt-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>
      <form
        className=" backdrop-blur-100 mt-20  gap-5 z-[50] flex flex-col justify-around items-center rounded-xl  transition-all "
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
        <section className="h-96 flex flex-col items-center justify-around gap-3">
        <h2 className="text-5xl">
          <span>A</span>cceder
        </h2>
        <div className="flex flex-col gap-2 justify-between text-xl ">
          <p><span>E</span>mail</p>
          <input type="email" {...register("email", { required: true })} />
          <p><span>P</span>assword</p>
          <input
            type="password"
            {...register("password", { required: true })}
          />
        </div>

        <button className="btn" type="submit">
          Acceder
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
