import React, { useEffect, useState } from "react";
import { createBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { arrayGenres } from "../components/Images_Genres";
import { uploadImg } from "../api/auth";

export default function CreateBook() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState()

  const handleImage = async (e) => {
    
    const formData = await new FormData();
    formData.append("imageUrl", e.target.files[0]);
    const res = await uploadImg(formData);
   
    setImageUrl(res.data.fileUrl);
  };

  const onSubmit = handleSubmit(async (values) => {
    const dataValues ={
      values:values,
      imageBook:imageUrl
    }
    
    const res = await createBook(dataValues);
    localStorage.setItem("bookId",res.data.newBook._id)
     navigate("/editBook"); 
  });

  return (
    <main className=" mt-40 w-screen h-screen text-white flex flex-col items-center">
      <h2 className="flex text-7xl mx-auto">Crea tu libro </h2>
      <form className="p-10 flex flex-col h-96  gap-5 text-2xl" onSubmit={onSubmit}>
        <div className=" flex flex-col ">
          <label className="p-2">Título</label>
          <input {...register("title", { required: true })} />
        </div>
        <div className="flex flex-col">
          <label className="p-2">Descripción</label>
          <textarea {...register("description", { required: true })} />
        </div>
        <div className="flex flex-col">
          <label className="p-2">Género</label>
          <select {...register("genre")}>
        {
          arrayGenres.map((e,i)=>{
            return (
              <option key={i} value={e.genre}>
                {e.genre}
              </option>
            )
          })
        }
      </select>       
        </div>
        <input
            type="file"
            className="w-72 py-10 my-5 bg-transparent flex items-center justify-center text-center"
            onChange={(e) => handleImage(e)}                    
          />
        <button  className="bg-slate-400 w-40 h-10" type="submit">
          Crear libro
        </button>
      </form>
    </main>
  );
}
