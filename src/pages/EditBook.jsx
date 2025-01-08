import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { profile } from "../api/auth";

export default function EditBook() {
  const [booksUser, setBooksUser] = useState([]);
  const [verifyDelete, setVerifyDelete] = useState({ verify: false, chapterIndex: null });
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
    updateBook({ ...book, chapters: updatedChapters });
    localStorage.setItem("numChapter", updatedChapters.length);
    navigate("/writingPage");
  };

  const handleDeleteChapter = (index) => {
    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    updateBook({ ...book, chapters: updatedChapters });
    setVerifyDelete({ verify: false, chapterIndex: null });
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
    <main className="w-full h-screen overflow-x-hidden">
      <section className="relative w-full px-5 sm:px-10 lg:px-20 mt-10 lg:mt-20">
        {/* Background effects */}
        <div className="fixed w-72 h-10 left-1/2 transform -translate-x-1/2 rounded-full bg-blue-600/5 mt-20 blur-xl"></div>
        <div className="fixed w-72 h-10 top-40 left-10 rounded-full bg-red-600/10 blur-xl"></div>
        <div className="fixed w-80 h-10 top-40 right-10 bg-gradient-to-b from-green-600/15 blur-xl"></div>

        {/* Book title */}
        {book?.title && (
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl text-center mb-5 lg:mb-10">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        )}

        {/* Chapters list */}
        {book?.chapters?.length > 0 && (
          <>
            <div className="flex flex-wrap justify-between items-center text-white bg-gradient-to-r p-5 rounded-xl sm:rounded-3xl from-orange-600/[0.5]">
              <h3 className="w-1/3 sm:w-20 border-r border-orange-500">Nº</h3>
              <h3 className="w-full sm:w-1/2 lg:w-96 border-r border-orange-500 text-center sm:text-left">Capítulo</h3>
              <h3 className="hidden sm:block w-1/4 sm:w-40">Última actualización</h3>
            </div>

            {book.chapters.map((chapter, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between items-center text-white bg-gradient-to-r px-5 py-2 my-5 rounded-xl sm:rounded-3xl from-slate-600/[0.5]"
              >
                <h3 className="w-1/3 sm:w-20 border-r border-orange-500">{`#${index + 1}`}</h3>
                <h3 className="w-full sm:w-1/2 lg:w-96 text-center sm:text-left border-r border-orange-500">
                  {chapter.title}
                </h3>
                <h3 className="hidden sm:block w-1/4 sm:w-52 border-r border-orange-500">
                  {new Date(book.updatedAt).toLocaleDateString("es-ES")}
                </h3>
                <div className="flex gap-2 sm:gap-5 w-full sm:w-auto justify-center mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      localStorage.setItem("numChapter", index + 1);
                      navigate("/writingPage");
                    }}
                    className="btn"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setVerifyDelete({ verify: true, chapterIndex: index })}
                    className="btn w-20"
                  >
                    Eliminar
                  </button>
                </div>
                {verifyDelete.verify && verifyDelete.chapterIndex === index && (
                  <div className="absolute flex items-center gap-5 z-50 bg-slate-700 p-2 rounded-full">
                    <span className="text-red-400 font-bold">¿Eliminar capítulo?</span>
                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="text-green-400 font-bold"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setVerifyDelete({ verify: false, chapterIndex: null })}
                      className="text-red-400 font-bold"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-5 justify-center sm:justify-start mt-10">
          <button onClick={handleAddChapter} className="btn">
            Añadir Capítulo
          </button>
          <button onClick={() => navigate("/pageBook")} className="btn">
            Ver Libro
          </button>
          <button onClick={() => navigate("/readBook")} className="btn">
            Leer Libro
          </button>
          <button onClick={() => setIsEditingDescription(true)} className="btn">
            Editar Descripción
          </button>
        </div>

        {/* Edit description */}
        {isEditingDescription && (
          <form onSubmit={handleDescriptionUpdate} className="mt-10">
            <textarea
              name="description"
              className="w-full h-40 rounded-md bg-slate-800 text-white p-2"
              placeholder="Nueva descripción"
            />
            <div className="flex gap-5 justify-center mt-5">
              <button
                type="button"
                onClick={() => setIsEditingDescription(false)}
                className="text-red-600 font-bold"
              >
                Cancelar
              </button>
              <button type="submit" className="text-green-600 font-bold">
                Guardar
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
