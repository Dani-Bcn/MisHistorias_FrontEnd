import React, { useEffect, useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function LoginUser() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [response, setResponse] = useState(null);
  const [loginError, setLoginError] = useState({
    email: false,
    password: false,
  });

  const onSubmit = async (values) => {
    try {
      const res = await loginUser(values);
      setResponse(res.data);

      // Maneja el token y redirige
      if (res.data?.message) {
        setLoginError({
          email: res.data.message === "Correo no válido",
          password: res.data.message === "Contraseña no válida",
        });
      } else {
        localStorage.setItem("token", res.data.token);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
    }
  };

  useEffect(() => {
    if (response?.data?.message) {
      console.log(response.data.message);  // Puedes agregar un mensaje de log
    }
  }, [response]);

  return (
    <main className="overflow-hidden relative w-screen h-screen text-white flex justify-center items-center flex-col">
      {/* Background effects */}
      <div className="absolute w-[900px] h-[900px] rounded-full bg-blue-600/5 -mt-[400px] -ml-[1200px] blur-xl"></div>
      <div className="absolute w-[900px] h-[900px] rounded-full bg-red-600/10 mt-[400px] ml-[1200px] blur-xl"></div>
      <div className="absolute w-[350px] h-[450px] mt-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>

      {/* Login Form */}
      <form
        className="backdrop-blur-100 mt-40 z-[50] flex flex-col justify-around items-center rounded-xl transition-all"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="flex flex-col items-center justify-around gap-20">
          <h2 className="text-5xl"><span>A</span>cceder</h2>
          <div className="flex flex-col gap-10 justify-between text-xl">
            <input
              className="bg-black/0 border-2 border-orange-400"
              type="email"
              {...register("email", { required: "Correo electrónico es obligatorio" })}
              placeholder="Correo electrónico"
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            
            <input
              className="bg-black/0 border-2 border-orange-400"
              type="password"
              {...register("password", { required: "La contraseña es obligatoria" })}
              placeholder="Contraseña"
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>

          <button className="btn text-2xl -mt-10" type="submit">
            <span>E</span>nviar
          </button>
        </section>

        {/* Error Message Section */}
        <section className="h-40 flex flex-col items-center gap-3">
          {loginError.password && (
            <div className="h-10 flex flex-col justify-around items-center gap-2 text-xl text-red-500">
              <p>{response?.message}</p>
              <button className="btn">¿Olvidaste tu contraseña?</button>
            </div>
          )}
          {loginError.email && (
            <div className="text-red-500 h-20 text-xl flex flex-col items-center justify-around gap-2">
              <p>{response?.message}</p>
              <button onClick={() => navigate("/register")} className="btn">
                ¿No tienes cuenta?
              </button>
            </div>
          )}
        </section>
      </form>
    </main>
  );
}
