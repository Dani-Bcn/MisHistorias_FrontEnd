import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function WritingPage() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState({ title: "", text: "" });

  const numberChapter = localStorage.getItem("numChapter");

  // Función para obtener el libro de localStorage
  const getBookLocal = async () => {
    const res = await getBook(localStorage.getItem("bookId"));
    setBook(res.data);
  };

  useEffect(() => {
    getBookLocal();
  }, []);

  useEffect(() => {
    if (book && book.chapters) {
      const currentChapter = book.chapters[numberChapter - 1] || { title: "", text: "" };
      setChapter(currentChapter);
    }
  }, [book, numberChapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChapter((prevChapter) => ({ ...prevChapter, [name]: value }));
  };

  const saveChapter = async (e) => {
    e.preventDefault();

    const updatedChapters = [...book.chapters];
    updatedChapters[numberChapter - 1] = chapter;

    const updatedBook = { ...book, chapters: updatedChapters };

    await editBook(book._id, updatedBook);
    navigate("/editBook");
  };

  if (!book) return null; // Espera que el libro cargue

  return (
    <main className="page-shell flex items-center justify-center">
      <section className="section-card w-full max-w-4xl">
        {book.chapters && (
          <form onSubmit={saveChapter} className="flex flex-col gap-4">
            <div className="mb-2 text-center">
              <h1 className="text-3xl font-bold text-white">Editar capítulo</h1>
              <p className="mt-2 text-sm text-slate-300">Cuida el título y el texto antes de guardar los cambios.</p>
            </div>
            <input
              placeholder="Título del capítulo"
              className="text-lg"
              name="title"
              type="text"
              onChange={handleChange}
              value={chapter.title}
            />

            <textarea
              name="text"
              type="text"
              placeholder="Texto"
              className="h-80 resize-none text-lg md:h-96"
              value={chapter.text}
              onChange={handleChange}
            />

            {chapter.title && chapter.text ? (
              <button
                type="submit"
                className="btn-primary w-full sm:w-fit">
                Guardar capítulo
              </button>
            ) : (
              <h3 className="text-center text-red-600">
                Debe escribir un título y un texto
              </h3>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
