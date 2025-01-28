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
/*   const verifyUser = async () => {
    try {
      window.scrollTo(0, 0);
      await profile(); // Opcional: manejar la respuesta si es necesario
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
    }
  }; */

  /* useEffect(() => {
    verifyUser();
  }, []); */ // Se asegura de que solo se ejecute una vez al montar el componente

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
        location.reload();
      } else {
        setErrorInput(true);
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setErrorInput(true);
    }
  });

  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      <img
        className="absolute w-full h-full opacity-10 z-[-1]"
        src="/images/sky-books.jpeg"
        alt="Background"
      />
      <form
        className="flex flex-col lg:gap-5  items-center justify-center transition-all"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl lg:text-5xl text-white my-4"><span>R</span>egistro</h2>

        <div className="flex flex-col sm:gap-2 lg:gap-6 gap-6 text-white justify-center items-center">
          <input
            className="bg-transparent border-2 border-indigo-400 p-1 lg:p-3"
            type="text"
            placeholder="Nombre"
            {...register("userName", { required: true })}
          />
          <input
            className="bg-transparent border-2 border-indigo-400 p-1 lg:p-3"
            type="text"
            placeholder="Apellido"
            {...register("lastName", { required: true })}
          />
          <input
            className="bg-transparent border-2 border-indigo-400 p-1 lg:p-3"
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: true })}
          />
          <input
            className="bg-transparent border-2 border-indigo-400 p-1 lg:p-3"
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: true })}
          />
          <input
            type="file"
            id="file-upload-button"
            onChange={handleImage}
            className="w-48 h-8 text-indigo-400 text-xs "
          />
          {imageUrl && (
            <button
              className="btn w-40 p-2 text-2xl m-auto mt-5"
              type="submit"
            >
              Enviar
            </button>
          )}
        </div>

        {errorInput && (
          <div className="text-red-500 text-xl mt-10 flex flex-col items-center">
            <p>{response?.message || "Ocurrió un error. Intenta nuevamente."}</p>
            <p>¿Ya tienes cuenta?</p>
            <button
              type="button"
              className="btn w-40 h-10 text-2xl mt-5 text-black"
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
