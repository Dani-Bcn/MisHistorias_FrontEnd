import React, { useEffect, useState } from "react";
import { getAllBooks, profile, addBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function AllBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(false);

  // Fetch books and user profile
  const fetchBooksAndProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      setAccess(!!token);

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

  // Add book to user's library
  const handleAddBook = async (bookId) => {
    if (!user?._id) return;

    try {
      await addBook({ bookId, userId: user._id });
      alert("Book added to your library!");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again later.");
    }
  };

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
  console.log(books)

  return (
    <main className="relative text-white w-screen mt-10">
      <section className="w-full max-w-4xl mx-auto p-4">
        {books.length > 0 ? (
          books.map((book, index) =>
            book.published ? (
              <div
                key={index}
                className="mt-5 p-4 bg-gray-800 rounded-md shadow-lg"
              >
                <div className="w-14 h-14 absolute -mt-3 -ml-3 z-10 bg-blue-300/50  rounded-full border-[3px] border-orange-400 flex justify-center items-center">
                <p className="text-5xl text-green-200">{book.rating}</p>
                </div>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <img
                    src={book.imageUrl}
                    alt="Book Cover"
                    className="w-32 h-48 object-cover rounded-md opacity-80"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{book.title}</h3>
                    <p className="text-lg">
                      {book.dataUser.userName} {book.dataUser.lastName}
                    </p>
                    <p className="text-lg">{book.genre}</p> 
                    <p>Capitulos : {book.chapters.length} </p>                  
                  </div>
                </div>
              
                <div
                  id={book.title.replace(/\s+/g, "")}
                  className="mt-2 text-sm hidden opacity-0"
                  onClick={() => toggleDescription(book.title, "hide")}
                >
                  {book.description}
                </div>
                <div className="mt-4 flex gap-4 flex-wrap">
                  <button
                    className="px-4 py-2 bg-slate-500 rounded text-white hover:bg-green-600"
                    onClick={() => handleNavigate("/PageBook", book._id)}
                  >
                     + info
                  </button>
                  <button
                    className="px-4 py-2 bg-slate-500 rounded text-white hover:bg-purple-600"
                    onClick={() => handleNavigate("/readBook", book._id)}
                  >
                    Leer
                  </button>
                  {user && (
                    <button
                      className="px-4 py-2 bg-orange-500 rounded text-white hover:bg-orange-600"
                      onClick={() => handleAddBook(book._id)}
                    >
                      Add  My blilioteca
                    </button>
                  )}
                  {book.comments.length > 0 && (
                    <button
                      className="px-4 py-2 bg-teal-500 rounded text-white hover:bg-teal-600"
                      onClick={() => handleNavigate("/readComments", book._id)}
                    >
                      Comentarios ({book.comments.length})
                    </button>
                  )}
                </div>
              </div>
            ) : null
          )
        ) : (
          null
        )}
      </section>
    </main>
  );
}
