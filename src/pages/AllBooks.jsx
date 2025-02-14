import React, { useEffect, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function AllBooks() {
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
    <main className=" w-screen my-20 text-slate-200 flex flex-col items-center">      
      <div className="w-screen mb-5 flex flex-col items-center justify-center">
        <h1 className="text-4xl my-5 font-bold text-center text-orange-400">
          {selectedGenre}
        </h1>
        <div className="w-[80%] h-[0.5px] bg-gradient-to-r from-indigo-500/0 via-purple-500 to-pink-500/0">
        </div>
      </div>
      <section className="w-[72%] xl:w-[90%]  flex flex-wrap gap-10 sm:gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div
              key={index}
              className="relative h-[400px] w-72 sm:w-56 xl:w-62 p-5 bg-black hover:shadow-none transition-all duration-500 shadow-black/50 rounded-lg shadow-lg flex flex-col"
            >
              <img
                src={book.imageUrl}
                alt="Book Cover"
                className="opacity-40  -m-5 w-full h-96 sm:h-full absolute z-0 mask  object-cover rounded-lg"
              />
              <h3 className="w-full  h-96 text-xl  font-bold text-center text-orange-400 flex items-center justify-center">
                {book.title}
              </h3>
              <div className="flex justify-end text-xl flex-col items-center">
                <div className="flex gap-2 items-center justify-center">
                  <span className="font-bold">{book.dataUser.userName}</span>
                  <p className="text-center text-transform: capitalize">
                    {book.dataUser.lastName}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-white gap-1 flex flex-col rounded-xl">
                <p>
                  <span>Género :</span> {book.genre}
                </p>

                <p>
                  <span>Capítulos :</span> {book.chapters.length}
                </p>
                <p className="h-40 sm:text-[12px] ">
                  <span>Sipnosis :</span> {book.description}
                </p>
              </div>
              <div className=" flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="w-10 h-10 flex justify-center items-center rounded-full border border-indigo-500">
                    {book.rating}
                  </p>
                  <div className="flex flex-col items-center justify-center mt-2">
                    <img
                      src="https://res.cloudinary.com/nneodani/image/upload/v1737915966/a1bbhiqtuctaocvffdhg.png"
                      alt="Rating Icon"
                      className="w-4"
                    />
                    <p>{book.numVotes}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNavigate("/PageBook", book._id)}
                    className="text-white px-2 border border-indigo-400 rounded-lg text-xs text-center"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => handleNavigate("/readBook", book._id)}
                    className="text-white px-2 py-2 border border-indigo-400 rounded-lg text-xs text-center"
                  >
                    Leer
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
       
            <p className="text-xl">
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
    <div className="relative p-5 bg-gray-800 rounded-lg shadow-lg flex flex-col animate-pulse">
      <div className="w-full h-96 bg-gray-700 rounded-lg"></div>
      <h3 className="mt-4 h-6 w-3/4 bg-gray-700 rounded"></h3>
      <div className="flex justify-center items-center gap-2 mt-2">
        <div className="h-6 w-16 bg-gray-700 rounded"></div>
        <div className="h-6 w-10 bg-gray-700 rounded"></div>
      </div>
      <div className="w-14 h-14 rounded-full bg-gray-700 border-2 border-orange-400 mt-2"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-700 rounded"></div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
        <div className="flex gap-2">
          <div className="h-8 w-14 bg-gray-700 rounded"></div>
          <div className="h-8 w-14 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};
