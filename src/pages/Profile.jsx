import React, { useEffect, useState } from "react";
import {
  profile,
  deleteBooks,
  deleteImg,
  removeBookLibrary,
  editBook,
} from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
   window.scrollTo(0, 0); 
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isLibrary, setIsLibrary] = useState(true);
  const [isPublicated, setIsPublicated] = useState(false);
  const [isDeleteBook, setIsDeleteBook] = useState(false);

  const getUser = async () => {
    const res = await profile();
    if (res && res.data.userFound) {
      setUser(res.data.userFound);
    } else {
      navigate("/allBooks");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handlePublish = async (bookId, published) => {
    try {
      // Actualiza el estado local
      const updatedBooks = user.books.map((book) =>
        book._id === bookId ? { ...book, published } : book
      );
      setUser({ ...user, books: updatedBooks });

      // Llama a la API
      await editBook(bookId, { published });
      await getUser(); // Espera a que getUser termine
    } catch (error) {
      console.error("Error al publicar el libro:", error);
    }
  };

  const deleteBookLibrary = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: user._id,
    };
    const res = await removeBookLibrary(objectsId);
    getUser();
  };

  const handleDeleteBook = (bookId) => {
    setIsDeleteBook(bookId);
  };

  return (
    <main className="page-shell">
      {user ? (
        <section className="page-container section-card flex flex-col items-center gap-6 text-center">
          <h2 className="page-title flex flex-wrap justify-center gap-3">
            <span className="font-bold">{user.userName}</span>
            {user.lastName}
          </h2>
          <p className="page-subtitle">Tu espacio para escribir, publicar y organizar las historias que quieres leer.</p>
          <div className="relative z-10 flex justify-center text-white">
            <button
              className="btn-primary text-base sm:text-lg"
              onClick={() => navigate("/createBook")}
            >
              Crea una nueva historia
            </button>
          </div>
        </section>
      ) : null}
      {user && user.books ? (
        <section className="page-container mt-12 flex flex-col gap-5">
          <h2 className="text-center text-3xl font-bold lg:text-4xl sm:text-left">
            <span>Mis</span> libros
          </h2>
          <div className="divider-glow"></div>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {user.books.map((book, i) => (
              <div
                key={i}
                className="book-card group min-h-[360px]"
              >
                <img
                  src={book.imageUrl}
                  alt="Book Cover"
                  className="book-cover-bg mask"
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight text-white">
                      {book.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-200">
                      <span className="font-bold text-indigo-200">{book.dataUser.userName}</span>
                      <p className="capitalize">{book.dataUser.lastName}</p>
                    </div>
                    <div className="mt-5 flex flex-col gap-1 rounded-xl text-sm text-white">
                      <p>
                        <span>Género :</span> {book.genre}
                      </p>
                      <p>
                        <span>Capítulos :</span> {book.chapters.length}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="my-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-400 bg-slate-950/70">
                          {book.rating}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <img
                            src="https://res.cloudinary.com/nneodani/image/upload/v1737915966/a1bbhiqtuctaocvffdhg.png"
                            alt="Rating Icon"
                            className="w-4"
                          />
                          <p>{book.numVotes}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      localStorage.setItem("bookId", book._id);
                      navigate("/PageBook");
                    }}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("bookId", book._id);
                      navigate("/ReadBook");
                    }}
                    className="btn-primary px-3 py-1.5 text-xs"
                  >
                    Leer
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem("bookId", book._id);
                      navigate("/editBook");
                    }}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Editar
                  </button>
                  {!book?.published ? (
                    <button
                      onClick={() => handlePublish(book._id, true)}
                      className="btn-secondary px-3 py-1.5 text-xs"
                    >
                      Publicar
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePublish(book._id, false)}
                      className="btn-secondary px-3 py-1.5 text-xs"
                    >
                      - publicar
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="btn-danger px-3 py-1.5 text-xs"
                  >
                    Eliminar
                  </button>
                  {isDeleteBook === book._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          deleteBooks(book._id);
                          getUser();
                        }}
                        className="btn-danger px-3 py-1.5 text-xs"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setIsDeleteBook(false)}
                        className="btn-secondary px-3 py-1.5 text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </section>
      ) : null}
      {user && user.booksLibrary.length > 0 ? (
        <section className="page-container py-16 text-3xl flex flex-col gap-5">
          <h2 className="text-center text-3xl font-bold text-white sm:text-left">
            <span>Mi</span> Biblioteca
          </h2>
          <div className="divider-glow"></div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {user.booksLibrary.map((book, i) => (
              <div key={i} className="glass-card p-4">
                <div className="relative">
                  <h2 className="pb-3 text-xl font-semibold">
                    <span>{book.title[0]}</span>
                    {book.title.slice(1)}
                  </h2>
                  <div className="flex gap-4">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="h-52 w-32 rounded-2xl object-cover"
                    />
                    <p className="absolute m-2 flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 bg-black/70 text-xl text-orange-200">
                      {book.rating}
                    </p>
                    <div className="flex flex-col gap-2 rounded-b-xl rounded-l-none text-xl">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          localStorage.setItem("bookId", book._id);
                          navigate("/readBook");
                        }}
                      >
                        Leer
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          localStorage.setItem("bookId", book._id);
                          navigate("/PageBook");
                        }}
                      >
                        Info
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBookLibrary(book._id)}
                        className="btn-danger"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
