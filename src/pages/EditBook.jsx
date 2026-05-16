import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { profile } from "../api/auth";

export default function EditBook() {
  window.scrollTo(0, 0);
  const [bookpublished, setBookPublished] = useState();
  const [booksUser, setBooksUser] = useState([]);
  const [verifyDelete, setVerifyDelete] = useState({
    verify: false,
    chapterIndex: null,
  });
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const res = await profile();
      if (res.data.message === "No autorizado") {
        navigate("/");
      } else {
        setBooksUser(res.data.userFound.books);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchBookDetails = async () => {
    try {
      const bookId = localStorage.getItem("bookId");
      const res = await getBook(bookId);
      if (res) {
        setBook(res.data);
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  useEffect(() => {
    if (book && booksUser.length > 0) {
      const userName = booksUser[0].dataUser.userName;
      if (book.dataUser.userName !== userName) {
        navigate("/profile");
      }
    }
  }, [book, booksUser]);

  useEffect(() => {
    fetchUserProfile();
    fetchBookDetails();
  }, []);

  const handleAddChapter = () => {
    const newChapter = { title: "", text: "" };
    const updatedChapters = [...book.chapters, newChapter];
    localStorage.setItem("numChapter", updatedChapters.length);
    navigate("/writingPage");
  };

  const handleDeleteChapter = (index) => {
    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    updateBook({ ...book, chapters: updatedChapters });
    setVerifyDelete({ verify: false, chapterIndex: null });
  };

  const handleChaptersPublished = (index) => {
    console.log(index)
    updateBook({ ...book, chaptersPublished: index +1 });
  };

  const handleDescriptionUpdate = (e) => {
    e.preventDefault();
    const updatedDescription = e.target.description.value;
    updateBook({ ...book, description: updatedDescription });
    setIsEditingDescription(false);
  };

  const updateBook = async (updatedBook) => {
    try {
      await editBook(updatedBook._id, updatedBook);
      setBook(updatedBook);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <main className="page-shell text-white">
      <section className="page-container">
        {/* Background effects */}
        <div className="fixed w-72 h-10 left-1/2 transform -translate-x-1/2 rounded-full bg-blue-600/5 mt-20 blur-xl"></div>
        <div className="fixed w-72 h-10 top-40 left-10 rounded-full bg-red-600/10 blur-xl"></div>
        <div className="fixed w-80 h-10 top-40 right-10 bg-gradient-to-b from-green-600/15 blur-xl"></div>

        {/* Book title */}
        {book?.title && (
          <h2 className="page-title mb-8">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        )}

        {/* Chapters list */}
        {book?.chapters?.length > 0 && (
          <main className="section-card">
            <div className="grid grid-cols-[64px_1fr] items-center gap-4 rounded-2xl border border-indigo-300/20 bg-indigo-500/15 p-4 text-white sm:grid-cols-[80px_1fr_200px_1fr]">
              <h3 className="w-1/3 sm:w-20 ">Nº</h3>
              <h3 className="text-left">
                Capítulo
              </h3>
              <h3 className="hidden sm:block">Actualizado</h3>
              <h3 className="hidden text-right sm:block">Acciones</h3>
            </div>
            {book.chapters.map((chapter, index) => (
              <div
                key={index}
                className="glass-card my-4 grid grid-cols-[64px_1fr] items-center gap-4 p-4 text-white sm:grid-cols-[80px_1fr_200px_1fr]"
              >
                <h3 className="w-1/3 sm:w-20 ">{`#${index + 1}`}</h3>
                <h3 className="text-left font-semibold">
                  {chapter.title}
                </h3>
                <h3 className="hidden text-sm text-slate-300 sm:block">
                  {new Date(book.updatedAt).toLocaleDateString("es-ES")}
                </h3>
                <div className="col-span-2 flex flex-wrap justify-center gap-2 sm:col-span-1 sm:justify-end">
                  <button
                    onClick={() => {
                      localStorage.setItem("numChapter", index + 1);
                      navigate("/writingPage");
                    }}
                    className="btn-secondary px-3 py-1.5"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      setVerifyDelete({ verify: true, chapterIndex: index })
                    }
                    className="btn-danger px-3 py-1.5"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={()=>handleChaptersPublished(index)}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >Publicar hasta aquí</button>
                </div>
                {verifyDelete.verify && verifyDelete.chapterIndex === index && (
                  <div className="absolute z-50 flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/40">
                    <span className="text-red-400 ">Confirmar</span>
                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="btn-danger px-3 py-1.5"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() =>
                        setVerifyDelete({ verify: false, chapterIndex: null })
                      }
                      className="btn-secondary px-3 py-1.5"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </main>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-start justify-center gap-3 sm:justify-start">
          <button
            onClick={handleAddChapter}
            className="btn-primary"
          >
            Añadir Capítulo
          </button>
          <button
            onClick={() => navigate("/pageBook")}
            className="btn-secondary"
          >
            Ver Libro
          </button>
          <button
            onClick={() => navigate("/readBook")}
            className="btn-secondary"
          >
            Leer Libro
          </button>
          <button
            onClick={() => setIsEditingDescription(true)}
            className="btn-secondary"
          >
            Editar Descripción
          </button>

          {/* Edit description */}
          {isEditingDescription && (
            <form className="glass-card w-full max-w-md p-4" onSubmit={handleDescriptionUpdate}>
              <textarea
                name="description"
                maxLength={150}
                minLength={25}
                className="h-40"
                placeholder={book.description}
              />
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingDescription(false)}
                  className="btn-danger"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
