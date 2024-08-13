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
      navigate("/Profile"), location.reload();
    } else {
      setErrorInput(true);
    }
  });

  return (
    <main className="w-screen h-screen flex justify-center  items-center flex-col">
      <img
        className="absolute w-screen h-screen opacity-[0.2] z-[-1]"
        src="/images/sky-books.jpeg"
      ></img> 
      <form
        className=" flex flex-col   justify-start items-center transition-all "
        onSubmit={onSubmit}
      >
        <h2 className="text-5xl text-white my-10 "><span>R</span>egistro</h2>        
        <input
          type="file"
          id="file-upload-button"
          onChange={(e) => handleImage(e)}
          className="input-file "
        />
        <div className="flex flex-col text-xl gap-5 justify-between  ">
          <input
            type="text "
            placeholder="Nombre"
        
            {...register("userName", { required: true })}
          />
          <input
            type="text"
            placeholder="Apellido"
            
            {...register("lastName", { required: true })}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
           
            {...register("email", { required: true })}
          />
          <input
            type="password"
            placeholder="contraseña"
            
            {...register("password", { required: true })}
          />

          <button className="btn w-40 p-2 text-xl m-auto mt-5" type="submit">
            Registrarse
          </button>
        </div>
        {errorInput ? (
          <div className="text-red-500 text-xl mt-40 flex flex-col items-center">
            <p>{response.message}</p>
            <p>Ya tienes cuenta ?</p>
            <button
              type="button"
              className="btn w-40 h-10 text-2xl mt-5 text-black"
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
