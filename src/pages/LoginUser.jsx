import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Componente para los efectos de fondo
const BackgroundEffects = () => (
  <>
    <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-3xl sm:h-[900px] sm:w-[900px]"></div>
    <div className="absolute -bottom-48 -right-40 h-[420px] w-[420px] rounded-full bg-red-600/10 blur-3xl sm:h-[900px] sm:w-[900px]"></div>
    <div className="absolute h-[320px] w-[260px] bg-gradient-to-b from-green-600/15 blur-3xl sm:h-[450px] sm:w-[350px]"></div>
  </>
);

// Componente para mostrar mensajes de error
const ErrorMessage = ({ message }) => (
  <div className="rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden px-4 pb-10 pt-28 text-white sm:justify-center sm:pt-32">
      <BackgroundEffects />
      <form
        className="section-card z-[50] flex w-full max-w-md flex-col items-center gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-bold">
          <span>A</span>cceder
        </h2>
        <p className="text-center text-sm text-slate-300">Entra en tu cuenta para continuar escribiendo y leyendo tus historias.</p>
        <input
          className="bg-slate-950/60"
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
          className="bg-slate-950/60"
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
          className="btn-primary w-full"
          type="submit"
        >
          <span>E</span>nviar
        </button>
        {serverError && <ErrorMessage message={serverError} />}
      </form>
    </main>
  );
}