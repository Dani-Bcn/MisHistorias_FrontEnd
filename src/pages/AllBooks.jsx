import React, { useEffect, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function AllBooks() {
  window.scrollTo(0, 0);
  

  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("Libros");
  const [loading, setLoading] = useState(true); // Estado de carga

  const fetchBooksAndProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const booksResponse = await getAllBooks();
      setBooks(booksResponse.data.booksFound || []);

      if (token) {
        const profileResponse = await profile();
        if (profileResponse?.data?.userFound) {
          setUser(profileResponse.data.userFound);
        }
      }
    } catch (error) {
      console.error("Error fetching books or profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksAndProfile();
  }, [title]);

  const handleNavigate = (path, bookId) => {
    localStorage.setItem("bookId", bookId);
    navigate(path);
  };

  const selectedGenre = localStorage.getItem("genero");
  const filteredBooks = books.filter(
    (book) =>
      book.published &&
      (book.genre === selectedGenre || selectedGenre === "Libros")
  );
 

  return (
    <main className="page-shell">      
      <div className="page-container mb-10 flex flex-col items-center justify-center">
        <p className="mb-3 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-orange-200">
          Biblioteca
        </p>
        <h1 className="page-title">
          {selectedGenre}
        </h1>
        <p className="page-subtitle">
          Descubre historias publicadas por la comunidad, guarda tus favoritas y empieza a leer desde cualquier género.
        </p>
        <div className="divider-glow mt-6 max-w-3xl">
        </div>
      </div>
      <section className="page-container grid grid-cols-1 gap-6 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div
              key={index}
              className="book-card group"
            >
              <img
                src={book.imageUrl}
                alt="Book Cover"
                className="book-cover-bg mask"
              />
              <div className="relative z-10 flex h-full w-full flex-col justify-between">
                <div>
                  <span className="rounded-full border border-orange-300/40 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
                    {book.genre}
                  </span>
                  <h3 className="mt-8 text-2xl font-bold leading-tight text-white">
                    {book.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-200">
                    <span className="font-bold text-indigo-200">{book.dataUser.userName}</span>
                    <p className="capitalize">{book.dataUser.lastName}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-2 text-sm text-slate-200">
                    <p>
                      <span>Capítulos :</span> {book.chapters.length}
                    </p>
                    <p className="line-clamp-5 leading-6">
                      <span>Sipnosis :</span> {book.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-4 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
                <div className="flex items-center gap-2">
                  <p className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-300/70 bg-slate-950/70 font-bold text-orange-200">
                    {book.rating}
                  </p>
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="https://res.cloudinary.com/nneodani/image/upload/v1737915966/a1bbhiqtuctaocvffdhg.png"
                      alt="Rating Icon"
                      className="w-4"
                    />
                    <p>{book.numVotes}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleNavigate("/PageBook", book._id)}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => handleNavigate("/readBook", book._id)}
                    className="btn-primary px-3 py-1.5 text-xs"
                  >
                    Leer
                  </button>
                </div>
                </div>
              </div>
            </div>
          ))
        ) : (
       
            <p className="col-span-full rounded-3xl border border-white/10 bg-white/[0.06] p-10 text-center text-xl text-slate-200">
              No se encontraron libros del género {selectedGenre.toLowerCase()}.
            </p>
         
        )}
      </section>
    </main>
  );
}

// Componente Skeleton Loader
const SkeletonLoader = () => {
  return (
    <div className="glass-card min-h-[420px] p-5 animate-pulse">
      <div className="h-56 w-full rounded-2xl bg-slate-700/70"></div>
      <h3 className="mt-4 h-6 w-3/4 rounded bg-slate-700/70"></h3>
      <div className="flex justify-center items-center gap-2 mt-2">
        <div className="h-6 w-16 rounded bg-slate-700/70"></div>
        <div className="h-6 w-10 rounded bg-slate-700/70"></div>
      </div>
      <div className="mt-4 h-14 w-14 rounded-full border-2 border-orange-400 bg-slate-700/70"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-700/70"></div>
        <div className="h-4 w-1/2 rounded bg-slate-700/70"></div>
        <div className="h-4 w-full rounded bg-slate-700/70"></div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-10 w-10 rounded-full bg-slate-700/70"></div>
        <div className="flex gap-2">
          <div className="h-8 w-14 rounded bg-slate-700/70"></div>
          <div className="h-8 w-14 rounded bg-slate-700/70"></div>
        </div>
      </div>
    </div>
  );
};
