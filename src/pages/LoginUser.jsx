import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Componente para los efectos de fondo
const BackgroundEffects = () => (
  <>
    <div className="absolute w-[900px] h-[900px] rounded-full bg-blue-600/5 -mt-[400px] -ml-[1200px] blur-xl"></div>
    <div className="absolute w-[900px] h-[900px] rounded-full bg-red-600/10 mt-[400px] ml-[1200px] blur-xl"></div>
    <div className="absolute w-[350px] h-[450px] mt-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>
  </>
);

// Componente para mostrar mensajes de error
const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-xl">
    <p>{message}</p>
  </div>
);

export default function LoginUser() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [serverError, setServerError] = useState(null);

  const onSubmit = useCallback(async (values) => {
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
        window.location.reload();
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setServerError("Error en el servidor. Intenta más tarde.");
    }
  }, [navigate, setError]);

  return (
    <main className="overflow-hidden relative w-screen h-screen text-white flex justify-center items-center flex-col">
      <BackgroundEffects />
      <form
        className="backdrop-blur-100 z-[50] flex flex-col justify-around items-center rounded-xl transition-all gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl">
          <span>A</span>cceder
        </h2>
        <input
          className="bg-black/0 border-2 border-indigo-400 p-2 rounded-3xl"
          type="email"
          {...register("email", {
            required: "Correo electrónico es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Correo electrónico no válido",
            },
          })}
          placeholder="Correo electrónico"
          onFocus={() => clearErrors("email")}
        />
        {errors.email && (
          <ErrorMessage message={errors.email.message} />
        )}
        <input
          className="bg-black/0 border-2 border-indigo-400  p-2 rounded-3xl"
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
          })}
          placeholder="Contraseña"
          onFocus={() => clearErrors("password")}
        />
        {errors.password && (
          <ErrorMessage message={errors.password.message} />
        )}
        <button
          className="btn border-2 border-orange-400 shadow-sm shadow-black hover:shadow-none transition-all duration-300 rounded-full px-5 py-2"
          type="submit"
        >
          <span>E</span>nviar
        </button>
        {serverError && <ErrorMessage message={serverError} />}
      </form>
    </main>
  );
}