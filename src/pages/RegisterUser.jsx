import React, { useEffect, useState } from "react";
import { registerUser,profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { uploadImg } from "../api/auth";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState(false);
  const [response, setResponse] = useState();
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState()

  const verifyUser=( async ()=>{
    const isMatch = await profile()
    console.log(isMatch.data.message)
     isMatch.data.message !== "No autorizado"? navigate("/"):null 
   })
     useEffect(()=>{
       verifyUser()
     },)

  const handleImage = async (e) => {
    
    const formData =  new FormData();
    formData.append("imageUrl", e.target.files[0]);
    const res = await uploadImg(formData);// subir la imagen a cloudinary
   
    setImageUrl(res.data.fileUrl);
  };

  imageUrl?console.log(imageUrl):null

  const onSubmit = handleSubmit(async (values) => {
    console.log(values)

    const dataValues ={
      values:values,
      imageUser:imageUrl
    }
    
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
    <main className="w-screen h-screen  flex justify-center  items-center flex-col">
      <form
        className="h-[650px] flex flex-col gap-10 justify-start items-center border-2 border-orange-400 p-10 rounded-xl bg-gradient-to-b from-indigo-400/[0.5] hover:shadow-[0_35px_60px_-15px_rgb(0,0,0)] transition-all "
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl">Registro</h2>
        <input
            type="file" id="file-upload-button"
            className="w-72 text-transparent bg-transparent flex items-center justify-center text-center"
            onChange={(e) => handleImage(e)}                    
          />

        <div className="flex gap-2  flex-col h-40 justify-between text-2xl ">
          <p>Nombre</p>
          <input type="text " className="bg-slate-300" {...register("userName", { required: true })} />
          <p>Apellido</p>
          <input type="text" className="bg-slate-300"  {...register("lastName", { required: true })} />
          <p>Email</p>
          <input type="email" className="bg-slate-300"  {...register("email", { required: true })} />
          <p>Password</p>
          <input
            type="password" className="bg-slate-300" 
            {...register("password", { required: true })}
          />
        
          <button className="w-40 p-2 text-2xl m-auto mt-5" type="submit">
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
