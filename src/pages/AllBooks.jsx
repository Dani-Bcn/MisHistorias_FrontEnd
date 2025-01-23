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
    <main className="w-screen   text-slate-50 flex flex-col p-5">
     
       
        {books.length > 0
          ? books.map((book, index) =>
              book.published ? (
                <div key={index} className="mt-10 bg-red-600/35 w-full p-5 rounded-3xl">
                  <p className="absolute mt-7 ml-1 flex justify-center items-center  w-10 h-10 bg-blue-800/85 rounded-full border-2 border-orange-500">
                    {book.rating}
                  </p>

                  <div>
                    <h3>{book.title}</h3>
                    <img
                      src={book.imageUrl}
                      alt="Book Cover"
                      className="w-20 h-32"
                    />
                    <div>
                      <p>
                        {book.dataUser.userName} {book.dataUser.lastName}
                      </p>
                      <p>{book.genre}</p>
                      <p>Capitulos : {book.chapters.length} </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleNavigate("/PageBook", book._id)}
                    >
                      + info
                    </button>
                    <button
                      onClick={() => handleNavigate("/readBook", book._id)}
                    >
                      Leer
                    </button>
                    {user && (
                      <button onClick={() => handleAddBook(book._id)}>
                        Add My blilioteca
                      </button>
                    )}
                    {book.comments.length > 0 && (
                      <button
                        onClick={() =>
                          handleNavigate("/readComments", book._id)
                        }
                      >
                        Comentarios ({book.comments.length})
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
