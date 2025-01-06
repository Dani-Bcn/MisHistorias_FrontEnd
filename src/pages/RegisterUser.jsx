import React, { useEffect, useState } from "react";
import { registerUser, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { uploadImg } from "../api/auth";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState(false);
  const [response, setResponse] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Verificación del usuario al cargar la página
  useEffect(() => {
    const verifyUser = async () => {
      window.scrollTo(0, 0);
      await profile();
    };

    verifyUser();

    // Limpieza si es necesario
    return () => { 
      setErrorInput(false);
      setResponse(null);
      setImageUrl(null);
    };
  }, []);

  // Manejo de la imagen
  const handleImage = async (e) => {
    const formData = new FormData();
    formData.append("imageUrl", e.target.files[0]);
    try {
      const res = await uploadImg(formData);
      setImageUrl(res.data.fileUrl);
    } catch (err) {
      console.error("Error al subir la imagen", err);
    }
  };

  // Manejo del envío del formulario
  const onSubmit = async (values) => {
    const dataValues = {
      values,
      imageUser: imageUrl,
    };

    try {
      const res = await registerUser(dataValues);
      setResponse(res.data);

      if (!res.data.message) {
        navigate("/login");
      } else {
        setErrorInput(true);
      }
    } catch (err) {
      console.error("Error al registrar el usuario", err);
      setErrorInput(true);
    }
  };

  return (
    <main className="w-screen h-[100vh] flex justify-start items-center flex-col overflow-hidden">
      <img className="absolute w-screen h-full opacity-[0.1] z-[-1]" src="/images/sky-books.jpeg" alt="Background" />
      <form className="flex flex-col mt-20 justify-start items-center transition-all" onSubmit={onSubmit}>
        <h2 className="text-5xl text-white my-10">
          <span>R</span>egistro
        </h2>

        <div className="flex flex-col text-xl gap-5 justify-between text-white">
          <input
            className="bg-black/0 border-2 border-orange-400"
            type="text"
            placeholder="Nombre"
            {...register("userName", { required: "Este campo es obligatorio" })}
          />
          {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
          
          <input
            className="bg-black/0 border-2 border-orange-400"
            type="text"
            placeholder="Apellido"
            {...register("lastName", { required: "Este campo es obligatorio" })}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

          <input
            className="bg-black/0 border-2 border-orange-400"
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: "Correo electrónico es obligatorio", pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            className="bg-black/0 border-2 border-orange-400"
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" } })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <input
            type="file"
            id="file-upload-button"
            onChange={handleImage}
            className="w-96 input-file h-20 text-orange-400"
          />

          {imageUrl && (
            <button className="btn w-40 p-2 text-2xl m-auto mt-5" type="submit">
              <span>E</span>nviar
            </button>
          )}
        </div>

        {errorInput && response?.message && (
          <div className="absolute text-red-500 text-xl mt-[400px] ml-[600px] flex flex-col items-center">
            <p>{response.message}</p>
            <p>¿Ya tienes cuenta?</p>
            <button
              type="button"
              className="btn w-40 h-10 text-2xl mt-5"
              onClick={() => navigate("/login")}
            >
              <span>A</span>cceder
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
