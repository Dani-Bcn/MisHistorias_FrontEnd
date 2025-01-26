import React, { useEffect, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function AllBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch books and user profile
  const fetchBooksAndProfile = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchBooksAndProfile();
  }, []);

  // GSAP animations
  const toggleDescription = (title, action) => {
    const elementId = title.replace(/\s+/g, "");
    gsap.to(`#${elementId}`, {
      visibility: action === "show" ? "visible" : "hidden",
      opacity: action === "show" ? 1 : 0,
      marginTop: action === "show" ? 40 : 0,
    });
  };

  const handleNavigate = (path, bookId) => {
    localStorage.setItem("bookId", bookId);
    navigate(path);
  };

  return (
    <main className="w-screen min-h-screen text-white flex flex-col items-center bg-gray-900">
      <section className="w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-20">
        {books.length > 0 ? (
          books.map(
            (book, index) =>
              book.published && (
                <div
                  key={index}
                  className="bg-gray-800 shadow-teal-300 rounded-lg shadow-lg p-4 flex flex-col"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={book.imageUrl}
                      alt="Book Cover"
                      className=" w-48 h-56 object-cover rounded-lg"
                    />
                    <h3 className="text-xl font-bold mt-4 text-center">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                      {book.dataUser.userName} {book.dataUser.lastName}
                    </p>
                    <img
                      src={book.dataUser.imageUserUrl}
                      alt="User"
                      className="w-12 h-12 rounded-full mt-2 object-cover"
                    />
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    <p>
                      <strong>Género:</strong> {book.genre}
                    </p>
                    <p>
                      <strong>Capítulos:</strong> {book.chapters.length}
                    </p>
                    <p className="truncate">
                      <strong>Sinopsis:</strong> {book.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p>{book.rating}</p>
                      <img
                        src="/public/images/icono.png"
                        alt="Rating Icon"
                        className="w-6"
                      />
                      <p>{book.numVotes}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleNavigate("/PageBook", book._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        + Info
                      </button>
                      <button
                        onClick={() => handleNavigate("/readBook", book._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Leer
                      </button>
                    </div>
                  </div>
                </div>
              )
          )
        ) : (
          <p className="text-gray-400">No hay libros publicados disponibles.</p>
        )}
      </section>
    </main>
  );
}
