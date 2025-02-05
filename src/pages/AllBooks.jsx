import React, { useEffect, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

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

  const handleNavigate = (path, bookId) => {
    localStorage.setItem("bookId", bookId);
    navigate(path);
  };

  return (
    <main className=" h-min-screen   text-slate-200 flex flex-col items-center ">
      <section className="w-[72%] lg:w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 py-20 ">
        {books.length > 0 ? (
          books.map(
            (book, index) =>
              book.published && (
                <div
                  key={index}
                  className="aspect-auto relative p-5 bg-gray-800 hover:shadow-none transition-all duration-500 shadow-black/50 rounded-lg shadow-lg flex flex-col items-around justify-between gap-5"
                >
                  <img
                    src={book.imageUrl}
                    alt="Book Cover"
                    aspect-square





                    alt="Book Cover"
                    className=" opacity-30 -m-5 w-full h-96 sm:h-full  absolute z-0   mask object-cover rounded-lg"
                  />
                  <h3 className="h-10  z-10 text-2xl font-bold my-7 text-center text-orange-400">
                    {book.title}
                  </h3>
                  <div className="flex justify-end text-2xl flex-col items-center">
                    <div className="flex gap-2 items-center justify-center">
                      <span className="font-bold">
                        {book.dataUser.userName}
                      </span>
                      <p className=" text-center text-transform: capitalize"> {book.dataUser.lastName}</p>
                    </div>
                    <img
                      src={book.dataUser.imageUserUrl}
                      alt={book.dataUser.userName}
                      className="w-14 h-14 rounded-full border-2  border-orange-400 mt-2 object-cover"
                    />
                  </div>
                  <div className="mt-4 text-sm text-white gap-1 flex flex-col rounded-xl ">
                    <p>
                      <span>Género :</span> {book.genre}
                    </p>
                    <p>
                      <span>Capítulos :</span> {book.chapters.length}
                    </p>
                   <p ><span>Sipnosis :</span>  {book.description} </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="w-10 h-10 flex  justify-center items-center rounded-full border border-indigo-500">
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
                        className=" text-white px-2 py-2 border  border-indigo-400 rounded-lg text-xs text-center"
                      >
                        Info
                      </button>
                      <button
                        onClick={() => handleNavigate("/readBook", book._id)}
                        className=" text-white px-2 py-2 border  border-indigo-400 rounded-lg text-xs text-center"
                      >
                        Leer
                      </button>
                    </div>
                  </div>
                </div>
              )
          )
        ) : (
          null
        )}
      </section>
    </main>
  );
}
