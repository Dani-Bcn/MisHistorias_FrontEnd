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
    window.scrollTo(0, 0);
    const isMatch = await profile();
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

  const onSubmit = handleSubmit(async (values) => {
    const dataValues = {
      values: values,
      imageUser: imageUrl,
    };

    const res = await registerUser(dataValues);

    setResponse(res.data);
    if (!res.data.message) {
      navigate("/login")
     
    } else {
      setErrorInput(true);
    }
  });

  return (
    <main className="w-screen  h-[100vh] flex justify-start items-center flex-col overflow-hidden">
      <img
        className="absolute w-screen h-full   opacity-[0.1] z-[-1]"
        src="/images/sky-books.jpeg"
      ></img>
      <form
        className=" flex flex-col mt-20  justify-start items-center transition-all "
        onSubmit={onSubmit}
      >
        <h2 className="text-5xl text-white my-10 ">
          <span>R</span>egistro
        </h2>

        <div className="flex flex-col text-xl gap-5 justify-between text-white">
          <input
          className="bg-black/0 border-2 border-orange-400"
            type="text "
            placeholder="Nombre"
            {...register("userName", { required: true })}
          />
          <input
            className="bg-black/0 border-2 border-orange-400"
            type="text"
            placeholder="Apellido"
            {...register("lastName", { required: true })}
          />
          <input
            className="bg-black/0 border-2 border-orange-400"
            type="email"
            placeholder="Correo electrónico"
            {...register("email", { required: true })}
          />
          <input
            className="bg-black/0 border-2 border-orange-400"
            type="password"
            placeholder="contraseña"
            {...register("password", { required: true })}
          />
          <input
          
            type="file"
            id="file-upload-button"
            onChange={(e) => handleImage(e)}
            className="w-96 input-file h-20 text-orange-400"
          />
          {imageUrl ? (
            <button className="btn w-40 p-2 text-2xl m-auto mt-5" type="submit">
              <span>E</span>nviar
            </button>
          ) : null}
        </div>
        {errorInput ? (
          <div className="absolute text-red-500 text-xl mt-[400px] ml-[600px] flex flex-col items-center">
            <p>{response.message}</p>
            <p>Ya tienes cuenta ?</p>
            <button
              type="button"
              className="btn w-40 h-10 text-2xl mt-5"
              onClick={() => navigate("/login")}
            >
              <span>A</span>cceder
            </button>
          </div>
        ) : null}
      </form>
    </main>
  );
}
