import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBook, editBook, profile, addBook } from "../api/auth";
import gsap from "gsap";
import { use } from "react";

const RatingStars = ({ user, book, handleVote, handleOver, handleOut }) => {
  const stars = Array.from({ length: 10 }, (_, i) => ({
    num: i + 1,
    text: `star-${i + 1}`,
  }));

  return (
    <div className="flex gap-1 flex-wrap">
      {user &&
        book.dataUser.userId !== user._id &&
        !book.idUserVote.includes(user._id) &&
        stars.map((e) => (
          <div
            key={e.text}
            id={e.text}
            onClick={() => handleVote(e)}
            onMouseOver={() => handleOver(e)}
            onMouseOut={() => handleOut(e)}
            className="star w-5 h-5 bg-white cursor-pointer transition-all duration-200 hover:scale-110"
          />
        ))}
    </div>
  );
};

const ChaptersList = ({ chapters, toggleChapters }) => (
  <section className="absolute mt-5 ml-5 text-sm sm:text-base bg-white shadow-lg p-4 rounded max-w-xs sm:max-w-sm">
    {chapters.map((chapter, index) => (
      <div key={index} className="flex items-center gap-2 py-1">
        <span className="w-6 sm:w-8 text-center font-bold">{index + 1}</span>
        <button className="text-blue-500 hover:underline text-sm sm:text-base">
          {chapter.title}
        </button>
      </div>
    ))}
    <button
      onClick={toggleChapters}
      className="mt-2 text-red-500 hover:underline text-sm"
    >
      Cerrar
    </button>
  </section>
);

export default function PageBook() {
  const navigate = useNavigate();
  const [showChapters, setShowChapters] = useState(false);
  const [book, setBook] = useState(null);
  const [messageVote, setMessageVote] = useState(false);
  const [user, setUser] = useState(null);
  const [resultsLibarary, setResultsLibrary] = useState(false);
  const bookId = localStorage.getItem("bookId");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();
      if (res) setUser(res.data.userFound);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      const res = await getBook(bookId);
      if (res) setBook(res.data);
    };
    fetchBook();
  }, [bookId]);

  const handleVote = (rating) => {
    if (!book.idUserVote.includes(user._id)) {
      const updatedBook = {
        ...book,
        idUserVote: [...book.idUserVote, user._id],
        numVotes: book.numVotes + 1,
        reCountVotes: book.reCountVotes + rating.num,
      };
      updatedBook.rating = (
        updatedBook.reCountVotes / updatedBook.numVotes
      ).toFixed(1);

      editBook(updatedBook._id, updatedBook);
      setBook(updatedBook);
    } else {
      setMessageVote(true);
    }
  };

  const handleMouseOver = (e) => {
    gsap.to(`#${e.text}`, { background: "rgb(255,115,0)" });
  };

  const handleMouseOut = (e) => {
    gsap.to(`#${e.text}`, { background: "rgb(255,255,255)" });
  };

  /*  books.map((book) => {  
    console.log(book._id)
  }
  ) */
  console.log(bookId);
  user && user.booksLibrary && console.log("Bliblioteca", user.booksLibrary);
  useEffect(() => {
    user &&
      user.booksLibrary &&
      setResultsLibrary(
        user.booksLibrary.some((obj) => Object.values(obj).includes(bookId))
      );
  }, [user, bookId,resultsLibarary]);

  // Add book to user's library
  const handleAddBook = async (bookId) => {
    if (!user) return;

    try {
      await addBook({ bookId, userId: user._id });
      alert("Book added to your library!");
      location.reload();
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again later.");
    }
  };
  const handleNavigate = (path) => {    
    navigate(path);
  };

  return (
    <main className="w-screen flex justify-center px-4">
      {book && (
        <section className="max-w-4xl m-10 text-gray-100">
          <h2 className="text-4xl p-5 sm:text-6xl font-bold text-gray-100">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
          <div className="w-screen p-5 flex flex-col lg:flex-row gap-5">
            <div className="w-16 h-16 absolute mt-3 ml-3 z-10 bg-blue-800/50  rounded-full border-[3px] border-orange-400 flex justify-center items-center">
              <p className="text-5xl text-orange-200">{book.rating}</p>
            </div>
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="w-52 max-w-xs lg:max-w-sm h-auto object-cover rounded shadow mask"
            />
            <div className="flex flex-col gap-4">
              <h2 className="text-xl sm:text-3xl font-semibold">
                <span>{book.dataUser.userName}</span> {book.dataUser.lastName}
              </h2>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Género:</span> {book.genre}
              </p>
              <p className="text-base sm:text-lg">
                <span className="font-semibold">Capítulos : </span>
                <span
                  onClick={() => setShowChapters(!showChapters)}
                  className="cursor-pointer text-blue-500 hover:underline"
                >
                  {book.chapters.length}
                </span>
              </p>
              <div>
                <span>Descripción :</span>
                <p>{book.description}</p>
              </div>
              {showChapters && (
                <ChaptersList
                  chapters={book.chapters}
                  toggleChapters={() => setShowChapters(false)}
                />
              )}
              <div className="flex gap-2 text-1xl">
                <span>Creado : </span>
                <p>
                  {book.createdAt.slice(0, 10).split("-").reverse().join("-")}
                </p>
              </div>
              <div className="flex gap-2 text-1xl">
                <span>Modificado : </span>
                <p>
                  {book.updatedAt.slice(0, 10).split("-").reverse().join("-")}
                </p>
                
              </div>
              <button onClick={() => handleNavigate("/readBook", book._id)}>
                    Leer
                  </button>
              <RatingStars
                user={user}
                book={book}
                handleVote={handleVote}
                handleOver={handleMouseOver}
                handleOut={handleMouseOut}
              />

              {!resultsLibarary && user &&(
                <button onClick={() => handleAddBook(book._id)}>
                  Add My blilioteca
                </button>
              )}
              {messageVote && (
                <div
                  onClick={() => setMessageVote(false)}
                  className="text-red-600 mt-2 cursor-pointer text-sm"
                >
                  Ya has votado.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
