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
  console.log(books);

  return (
    <main className="w-screen mt-20   text-slate-50 flex flex-col p-5 gap-32">
      {books.length > 0
        ? books.map((book, index) =>
            book.published ? (
              <div key={index} className=" w-full  rounded-3xl">
                <p className="absolute  ml-1 flex justify-center items-center  w-10 h-10 bg-blue-800/85 rounded-full border-2 border-orange-500">
                  {book.rating}
                </p>

                <div className="h-72 flex flex-col justify-center items-center ">
                  <h3 className="text-1xl font-bold py-5 ">{book.title}</h3>
                  <div>
                    <img
                      src={book.imageUrl}
                      alt="Book Cover"
                      className="relative mask z-0 object-fill w-60 h-80 rounded-lg opacity-30"
                    />
                  </div>
                  <div className="absolute z-10  flex flex-col justify-center items-center gap-2">
                    <p className="text-2xl">
                      <span>{book.dataUser.userName}</span>
                      {book.dataUser.lastName}
                    </p>
                    <img
                      className=" w-20 h-20 object-cover border-4 border-orange-400 rounded-full"
                      src={book.dataUser.imageUserUrl}
                      alt=""
                    />
                    <p>{book.genre}</p>
                    <p>Capitulos : {book.chapters.length} </p>

                    <p>{book.description}</p>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-5">
                  <button onClick={() => handleNavigate("/PageBook", book._id)}>
                    + info
                  </button>
                  <button onClick={() => handleNavigate("/readBook", book._id)}>
                    Leer
                  </button>
                  {user && (
                    <button onClick={() => handleAddBook(book._id)}>
                      Add My blilioteca
                    </button>
                  )}
                  
                </div>
              </div>
            ) : null
          )
        : null}
    </main>
  );
}
