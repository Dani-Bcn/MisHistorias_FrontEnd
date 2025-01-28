import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { loginUser, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function LoginUser() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (values) => {
    try {
      const res = await loginUser(values);

      if (res.data?.message) {
        // Maneja errores según el mensaje del servidor
        if (res.data.message === "Correo no válido") {
          setError("email", {
            type: "server",
            message: "Correo no registrado",
          });
        } else if (res.data.message === "Contraseña no válida") {
          setError("password", {
            type: "server",
            message: "Contraseña incorrecta",
          });
        } else {
          setServerError(res.data.message); // Otros mensajes de error
        }
      } else {
        // Inicio de sesión exitoso
        const token = Cookies.get("token");

        localStorage.setItem("token", token);

        navigate("/profile");
        location.reload();
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setServerError("Error en el servidor. Intenta más tarde.");
    }
  };

  return (
    <main className="overflow-hidden relative w-screen h-screen text-white flex justify-center items-center flex-col">
      {/* Background effects */}
      <div className="absolute w-[900px] h-[900px] rounded-full bg-blue-600/5 -mt-[400px] -ml-[1200px] blur-xl"></div>
      <div className="absolute w-[900px] h-[900px] rounded-full bg-red-600/10 mt-[400px] ml-[1200px] blur-xl"></div>
      <div className="absolute w-[350px] h-[450px] mt-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>
      <form
        className="backdrop-blur-100   z-[50] flex flex-col justify-around items-center rounded-xl transition-all gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl">
          <span>A</span>cceder
        </h2>
        <input
          className="bg-black/0 border-2 border-indigo-400"
          type="email"
          {...register("email", {
            required: "Correo electrónico es obligatorio",
          })}
          placeholder="Correo electrónico"
          onFocus={() => clearErrors("email")}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
        <input
          className="bg-black/0 border-2 border-indigo-400"
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
          })}
          placeholder="Contraseña"
          onFocus={() => clearErrors("password")}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
        <button
          className="btn border-2 border-orange-400 shadow-sm shadow-black hover:shadow-none transition-all duration-300 rounded-full px-5"
          type="submit"
        >
          <span>E</span>nviar
        </button>
        {/* Error Message Section */}
        {serverError && (
          <div className="text-red-500 text-xl">
            <p>{serverError}</p>
          </div>
        )}
      </form>
    </main>
  );
}
