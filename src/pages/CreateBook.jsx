import React, { useState } from "react";
import { createBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { uploadImg } from "../api/auth";

export default function CreateBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

 const arrayGenres = [
    { genre: "Aventuras" },
    { genre: "Acción" },
    { genre: "Infantil" },
    { genre: "Terror" },
    { genre: "Clásico" },
    { genre: "Thriller" },
    { genre: "Policial" },
    { genre: "Romántico" },
    { genre: "Comedia" },
    { genre: "Cuentos" },
  ];

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
    <main className="page-shell flex items-center justify-center">
      <section className="page-container flex max-w-xl flex-col items-center">
        <div className="absolute bg-indigo-700/25 blur-3xl w-96 h-96"></div>
        <div className="mb-8 text-center">
          <h1 className="page-title">Nueva historia</h1>
          <p className="page-subtitle">Añade la portada, el género y una sinopsis breve para empezar a construir tu libro.</p>
        </div>
        <form
          className="section-card relative flex w-full flex-col gap-5 text-base"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col">
            <label className="field-label">Título</label>
            <input
              {...register("title", { required: "El título es obligatorio" })}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="field-label">Descripción</label>
            <textarea
              maxLength={220}
              placeholder="Máximo 220 caracteres"
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
              className="min-h-28"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <label className="field-label">Género</label>
            <select
              {...register("genre", { required: "Selecciona un género" })}
              className="text-base"
            >
              {arrayGenres.map((e, i) => (
                <option key={i} value={e.genre}>
                  {e.genre}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p className="text-red-500">{errors.genre.message}</p>
            )}
          </div>

          <input
            type="file"
            className="bg-slate-950/60 text-sm text-indigo-200"
            onChange={handleImage}
            disabled={isLoading}
          />

          {isLoading && <p className="text-yellow-500">Cargando imagen...</p>}

          {isImageUploaded && (
            <button className="btn-primary w-full" type="submit">
              Crear libro
            </button>
          )}
        </form>
      </section>
    </main>
  );
}
