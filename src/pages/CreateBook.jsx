import React, { useEffect, useState } from "react";
import { createBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { arrayGenres } from "../components/Images_Genres";
import { uploadImg } from "../api/auth";

export default function CreateBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [imageUrl, setImageUrl] = useState();

  const handleImage = async (e) => {
    const formData = await new FormData();
    formData.append("imageUrl", e.target.files[0]);
    const res = await uploadImg(formData);

    setImageUrl(res.data.fileUrl);
  };

  const onSubmit = handleSubmit(async (values) => {
    const dataValues = {
      values: values,
      imageBook: imageUrl,
    };

    const res = await createBook(dataValues);
    localStorage.setItem("bookId", res.data.newBook._id);
    navigate("/editBook");
  });

  return (
    <main className="w-screen h-screen text-white  flex flex-col items-center">
      <section className="relative flex flex-col items-center mt-28">
      <div className="absolute bg-indigo-700/25 blur-3xl w-96 h-96 "></div>
        <form className="relative w-72 flex flex-col gap-5 text-xl" onSubmit={onSubmit}>        
          <input
            type="file"
            className=" h-10  bg-transparent flex items-center justify-center text-center"
            onChange={(e) => handleImage(e)}
          />
          <div  className=" flex flex-col ">
            <label className="p-2">Título</label>
            <input className="h-7 rounded-md" {...register("title", { required: true })} />
          </div>
          <div className="flex flex-col">
            <label className="p-2">Descripción</label>
            <textarea
              {...register("description", { required: true })}
              className="h-7 rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center">
            <label className="p-2">Género</label>
            <select {...register("genre")} className="h-10 rounded-md text-[18px]">
              {arrayGenres.map((e, i) => {
                return (
                  <option key={i} value={e.genre}>
                    {e.genre}
                  </option>
                );
              })}
            </select>
          </div>

          <button className="btn" type="submit">
            Crear libro
          </button>
        </form>
      </section>
    </main>
  );
}
