import React, { useEffect, useState } from "react";
import { registerUser, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { uploadImg } from "../api/auth";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState(false);
  const [response, setResponse] = useState();
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState();

  const verifyUser = async () => {
    const isMatch = await profile();
    console.log(isMatch.data.message);
    isMatch.data.message !== "No autorizado" ? navigate("/") : null;
  };
  useEffect(() => {
    verifyUser();
  });

  const handleImage = async (e) => {
    const formData = new FormData();
    formData.append("imageUrl", e.target.files[0]);
    const res = await uploadImg(formData); // subir la imagen a cloudinary

    setImageUrl(res.data.fileUrl);
  };

  imageUrl ? console.log(imageUrl) : null;

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);

    const dataValues = {
      values: values,
      imageUser: imageUrl,
    };

    const res = await registerUser(dataValues);
    console.log(res.data.message);
    setResponse(res.data);
    if (!res.data.message) {
      navigate("/Profile"), location.reload();
    } else {
      setErrorInput(true);
    }
  });

  return (
    <main className="w-screen h-screen flex justify-center  items-center flex-col">
      <form
        className=" flex flex-col mt-40  justify-start items-center border-2 border-orange-400 p-10 rounded-xl bg-gradient-to-b from-indigo-400/[0.5] hover:shadow-[0_35px_60px_-15px_rgb(0,0,0)] transition-all "
        onSubmit={onSubmit}
      >
        <h2 className="text-xl ">Registro</h2>
        <input
          type="file"
          id="file-upload-button"
          className="w-40 my-5 text-[0.8rem] text-transparent cursor-pointer "
          onChange={(e) => handleImage(e)}
        />
        <div className="flex flex-col text-xl gap-2 justify-between  ">
          <input
            type="text "
            placeholder="Nombre"
            className="bg-slate-300  h-5 text-[0.8rem]"
            {...register("userName", { required: true })}
          />
          <input
            type="text"
            placeholder="Apellido"
            className="bg-slate-300  h-5 text-[0.8rem]"
            {...register("lastName", { required: true })}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="bg-slate-300  h-5 text-[0.8rem]"
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="contraseña"
            className="bg-slate-300  h-5 text-[0.8rem]"
            {...register("password", { required: true })}
          />

          <button className="w-40 p-2 text-xl m-auto mt-5" type="submit">
            Registrarse
          </button>
        </div>
        {errorInput ? (
          <div className="text-red-500 text-xl mt-40 flex flex-col items-center">
            <p>{response.message}</p>
            <p>Ya tienes cuenta ?</p>
            <button
              type="button"
              className="w-40 h-10 text-2xl mt-5 text-black"
              onClick={() => navigate("/login")}
            >
              Acceder
            </button>
          </div>
        ) : null}
      </form>
    </main>
  );
}
