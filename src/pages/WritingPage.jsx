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
    <main>
      <section className="w-[80vw] h-[60vh] m-20 mt-20">
        {book.chapters && (
          <form className="w-full h-[40vh] text-xl text-slate-300" onSubmit={saveChapter}>
            <input
              placeholder="Título del capítulo"
              className="w-96 my-1 h-10 bg-slate-800"
              name="title"
              type="text"
              onChange={handleChange}
              value={chapter.title}
            />

            <textarea
              className="w-full p-5 my-5 h-[300px] text-[15px] bg-slate-800"
              name="text"
              placeholder="Texto"
              value={chapter.text}
              onChange={handleChange}
            />

            {chapter.title && chapter.text ? (
              <button type="submit" className="btn">
                Guardar capítulo
              </button>
            ) : (
              <h3 className="text-red-600">Debe escribir un título y un texto</h3>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
