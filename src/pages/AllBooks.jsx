import React, { useEffect, useState } from "react";
import { getAllBooks, profile, addBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function AllBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(false);
  window.scrollTo(0, 0);

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
    <main className="w-screen  text-white flex justify-center items-center">
      <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5 mt-20">
        {books.length > 0
          ? books.map((book, index) =>
              book.published ? (
                <div
                  key={index}
                  className="w-36 h-[600px] flex gap-2 flex-col bg-red-300/50 items-center p-2"
                >
                  <h3 className="w-full h-24   text-center">{book.title}</h3>
                  <div className=" w-full flex justify-around items-center ">
                    <p className="w-10 h-10 border-orange-500 border-2 text-slate-900 font-semibold rounded-full text-center flex items-center justify-center text-2xl">
                      {book.rating}
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src="/public/images/icono.png"
                        alt=""
                        className="w-6 h-6"
                      />
                      <p>{book.numVotes}</p>
                    </div>
                  </div>
                  <div className="w-24 ">
                    <img
                      src={book.imageUrl}
                      alt="Book Cover"
                      className="w-24 h-32 object-cover aspect-w-16"
                    />
                  </div>
                  <div className="w-10 h-10">
                  <img
                    className="w-10 h-10 -mt-7 object-cover border-2 border-orange-400 rounded-full"
                    src={book.dataUser.imageUserUrl}
                    alt=""
                  />
                  </div>
                  <p>
                    <span>{book.dataUser.userName}</span>
                    {book.dataUser.lastName}
                  </p>

                  <p>{book.genre}</p>
                  <div className="w-full h-60 justify-center items-center  text-center  bg-red-800">
                    <p className=" w-full  bg-red-200 text-[12px]">
                      {book.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        localStorage.getItem("bookId", book._id),
                          handleNavigate("/PageBook", book._id);
                      }}
                    >
                      + info
                    </button>
                    <button
                      onClick={() => handleNavigate("/readBook", book._id)}
                    >
                      Leer
                    </button>
                  </div>
                </div>
              ) : null
            )
          : null}
      </section>
    </main>
  );
}
