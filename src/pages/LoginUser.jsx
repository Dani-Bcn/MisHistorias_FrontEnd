import React, { useEffect, useState } from "react";
import { loginUser, profile} from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function LoginUser() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [response, setResponse] = useState();

const verifyUser=( async ()=>{
 const isMatch = await profile()
 console.log(isMatch.data.message)
  isMatch.data.message !== "No autorizado"? navigate("/"):null 
})
  useEffect(()=>{
    verifyUser()
  })

  return (
    <main className="w-screen h-screen  flex justify-center  items-center flex-col">
      <img
        className="absolute w-screen h-screen opacity-[0.2] z-[-1]"
        src="/images/sky-books.jpeg"
      ></img>
 
      <form
        className=" backdrop-blur-100 z-[50] h-[600px] flex flex-col justify-around items-center  p-10 rounded-xl  transition-all "
        onSubmit={handleSubmit(async (values) => {
          console.log(values);

          const res = await loginUser(values);
          setResponse(res.data);
          console.log(res.data.message);

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
        <h2 className="text-5xl">Acceder</h2>
        <div className="flex flex-col h-32 justify-between text-2xl gap-2">
          <p>Email</p>
          <input type="email" {...register("email", { required: true })} />
          <p>Password</p>
          <input
            type="password"
            {...register("password", { required: true })}
          />
        </div>

        <button className="w-40 h-10 text-2xl mt-10" type="submit">
          Acceder
        </button>
        {errorPassword ? (
          <div className="flex flex-col items-center gap-5 text-xl text-red-500 ">
            <p>{response.message}</p>
            <p className="text-xl text-red-500 ">Olvidaste tu contraseña?</p>
            <button className=" w-40 h-10 text-black">Contraseña</button>
          </div>
        ) : null}
        {errorEmail ? (
          <div className="text-red-500 text-xl flex flex-col items-center gap-5">
            <p>{response.message}</p>
            <p className="text-red-500">No tienes cuenta?</p>
            <button
              onClick={() => navigate("/register")}
              className=" w-40 h-10 text-black"
            >
              Crear cuenta
            </button>
          </div>
        ) : null}
      </form>
    </main>
  );
}
