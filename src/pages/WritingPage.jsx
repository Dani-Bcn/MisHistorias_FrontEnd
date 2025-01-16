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
    <main className="w-screen mt-16 flex justify-center items-center px-4">
      <section className="w-[90%] h-[90%]  rounded-xs">
        {book.chapters && (
          <form onSubmit={saveChapter} className="flex flex-col gap-4">
            <input
              placeholder="Título del capítulo"
              className="w-full h-12 p-2 text-lg border border-orange-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              name="title"
              type="text"
              onChange={handleChange}
              value={chapter.title}
            />

            <textarea
              name="text"
              placeholder="Texto"
              className="w-full h-96 p-2 text-lg border border-orange-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 resize-none"
              value={chapter.text}
              onChange={handleChange}
            />

            {chapter.title && chapter.text ? (
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700"
              >
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

