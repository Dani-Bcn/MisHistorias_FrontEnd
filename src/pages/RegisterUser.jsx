import React, { useEffect, useState } from "react";
import { registerUser, profile, uploadImg } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState(false);
  const [response, setResponse] = useState(null);
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState("");

  // Verificar si el usuario está autenticado
  const verifyUser = async () => {
    try {
      window.scrollTo(0, 0);
      await profile(); // Opcional: manejar la respuesta si es necesario
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
    }
  }; 

   useEffect(() => {
    verifyUser();
  }, []); // Se asegura de que solo se ejecute una vez al montar el componente

  const handleImage = async (e) => {
    try {
      const formData = new FormData();
      formData.append("imageUrl", e.target.files[0]);
      const res = await uploadImg(formData);
      setImageUrl(res.data.fileUrl);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const dataValues = {
        values,
        imageUser: imageUrl,
      };
      const res = await registerUser(dataValues);
      setResponse(res.data);

      if (!res.data.message) {
        navigate("/profile");
       
      } else {
        setErrorInput(true);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setErrorInput(true);
    }
  });

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-hidden px-4 pb-10 pt-28 sm:justify-center sm:pt-32">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        src="/images/sky-books.jpeg"
        alt="Background"
      />
      <div className="absolute inset-0 bg-slate-950/75"></div>
      <form
        className="section-card relative z-10 flex w-full max-w-lg flex-col items-center justify-center"
        onSubmit={onSubmit}
      >
        <h2 className="text-4xl font-bold text-white lg:text-5xl"><span>R</span>egistro</h2>
        <p className="page-subtitle mb-6">Crea tu perfil de autor y lector para publicar historias y guardar tu biblioteca.</p>

        <div className="flex w-full flex-col gap-4 text-white">
          <input
            className="bg-slate-950/60"
            type="text"
            placeholder="Nombre"
            {...register("userName", { required: true })}
          />
          <input
            className="bg-slate-950/60"
            type="text"
            placeholder="Apellido"
            {...register("lastName", { required: true })}
          />
          <input
            className="bg-slate-950/60"
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: true })}
          />
          <input
            className="bg-slate-950/60"
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: true })}
          />
          <input
            type="file"
            id="file-upload-button"
            onChange={handleImage}
            className="text-xs text-indigo-200"
          />
          {imageUrl && (
            <button
              className="btn-primary mt-2 w-full"
              type="submit"
            >
              Enviar
            </button>
          )}
        </div>

        {errorInput && (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-red-300/30 bg-red-500/10 p-4 text-center text-red-200">
            <p>{response?.message || "Ocurrió un error. Intenta nuevamente."}</p>
            <p>¿Ya tienes cuenta?</p>
            <button
              type="button"
              className="btn-secondary mt-5"
              onClick={() => navigate("/login")}
            >
              Acceder
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
