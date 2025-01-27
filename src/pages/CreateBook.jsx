import React, { useState } from "react";
import { createBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { arrayGenres } from "../components/Images_Genres";
import { uploadImg } from "../api/auth";

export default function CreateBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  // Función para manejar la subida de imagen
  const handleImage = async (e) => {
    try {
      const formData = new FormData();
      formData.append("imageUrl", e.target.files[0]);
      

      setIsLoading(true);
      const res = await uploadImg(formData);
      setImageUrl(res.data.fileUrl);
      setIsImageUploaded(true);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setIsImageUploaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo del submit del formulario
  const onSubmit = handleSubmit(async (values) => {
    try {
      const dataValues = {
        values,
        imageBook: imageUrl,
      };

      const res = await createBook(dataValues);
      localStorage.setItem("bookId", res.data.newBook._id);
      navigate("/profile");
      location.reload();
    } catch (error) {
      console.error("Error al crear el libro:", error); 
    }
  });

  return (
    <main className="w-screen h-screen text-white flex flex-col items-center">
      <section className="relative flex flex-col items-center mt-28">
        <div className="absolute bg-indigo-700/25 blur-3xl w-96 h-96"></div>
        <form
          className="relative w-72 flex flex-col gap-5 text-xl"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col">
            <label className="p-2">Título</label>
            <input
              {...register("title", { required: "El título es obligatorio" })}
              className="h-7 rounded-md"
            />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          <div className="flex flex-col">
            <label className="p-2">Descripción</label>
            <textarea maxLength="150"
              {...register("description", { required: "La descripción es obligatoria" })}
              className="h-7 rounded-md"
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex flex-col justify-center">
            <label className="p-2">Género</label>
            <select
              {...register("genre", { required: "Selecciona un género" })}
              className="h-10 rounded-md text-[18px]"
            >
              {arrayGenres.map((e, i) => (
                <option key={i} value={e.genre}>
                  {e.genre}
                </option>
              ))}
            </select>
            {errors.genre && <p className="text-red-500">{errors.genre.message}</p>}
          </div>

          <input
            type="file"
            className="my-10 h-10 bg-transparent"
            onChange={handleImage}
            disabled={isLoading}
          />

          {isLoading && <p className="text-yellow-500">Cargando imagen...</p>}

          {isImageUploaded && (
            <button className="btn text-2xl" type="submit">
              <span>C</span>rear libro
            </button>
          )}
        </form>
      </section>
    </main>
  );
}

