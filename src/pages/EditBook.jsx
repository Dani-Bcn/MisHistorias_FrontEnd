import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { profile } from "../api/auth";

export default function EditBook() {
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
    <main className="w-screen  flex justify-center text-white ">
      <section className=" mt-14 ">
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
          <main className="p-5">
            <div className="flex flex-wrap justify-between items-center text-white bg-gradient-to-r p-5 rounded-xl sm:rounded-3xl from-indigo-600/[0.5]">
              <h3 className="w-1/3 sm:w-20 ">Nº</h3>
              <h3 className="w-full sm:w-1/2 lg:w-96  text-center sm:text-left">
                Capítulo
              </h3>
              <h3 className="hidden sm:block w-1/4 sm:w-40">
                Última actualización
              </h3>
            </div>
            {book.chapters.map((chapter, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between items-center text-white bg-gradient-to-r px-5 py-2 my-5 rounded-xl sm:rounded-3xl from-slate-600/[0.5]"
              >
                <h3 className="w-1/3 sm:w-20 ">{`#${index + 1}`}</h3>
                <h3 className="w-full sm:w-1/2 lg:w-96 text-center sm:text-left ">
                  {chapter.title}
                </h3>
                <h3 className="hidden sm:block w-1/4 sm:w-52 ">
                  {new Date(book.updatedAt).toLocaleDateString("es-ES")}
                </h3>
                <div className="flex gap-2 sm:gap-5 w-full sm:w-auto justify-center mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      localStorage.setItem("numChapter", index + 1);
                      navigate("/writingPage");
                    }}
                    className="border-[0.5px] border-indigo-400 rounded-2xl py-1 px-2 "
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      setVerifyDelete({ verify: true, chapterIndex: index })
                    }
                    className="border-[0.5px] border-indigo-400 rounded-2xl py-1 px-2 "
                  >
                    Eliminar
                  </button>
                </div>
                {verifyDelete.verify && verifyDelete.chapterIndex === index && (
                  <div className="absolute flex items-center gap-5 z-50 bg-slate-700 p-2 rounded-full">
                    <span className="text-red-400 ">Confirmar</span>
                    <button
                      onClick={() => handleDeleteChapter(index)}
                      className="border-[0.5px] border-green-400 rounded-2xl py-1 px-2 "
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() =>
                        setVerifyDelete({ verify: false, chapterIndex: null })
                      }
                      className="border-[0.5px] border-red-400 rounded-2xl py-1 px-2 "
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
        <div className="flex flex-wrap gap-5 justify-start items-start sm:justify-start h-56 pl-5 ">
          <button
            onClick={handleAddChapter}
            className="border-[0.5px] border-indigo-400 w-32 rounded-2xl py-1 px-2 "
          >
            Añadir Capítulo
          </button>
          <button
            onClick={() => navigate("/pageBook")}
            className="border-[0.5px] border-indigo-400 w-32 rounded-2xl py-1 px-2 "
          >
            Ver Libro
          </button>
          <button
            onClick={() => navigate("/readBook")}
            className="border-[0.5px] border-indigo-400 w-32 rounded-2xl py-1 px-2 "
          >
            Leer Libro
          </button>
          <button
            onClick={() => setIsEditingDescription(true)}
            className="border-[0.5px] border-indigo-400 w-40 rounded-2xl py-1 px-2 "
          >
            Editar Descripción
          </button>

          {/* Edit description */}
          {isEditingDescription && (
            <form onSubmit={handleDescriptionUpdate}>
              <textarea
                name="description"
                maxLength={150}
                minLength={25}
                className="w-72 h-40 rounded-md bg-slate-800 text-white p-2"
                placeholder={book.description}
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
        </div>
      </section>
    </main>
  );
}
