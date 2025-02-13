import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBook, editBook, profile, addBook } from "../api/auth";
import gsap from "gsap";
import { use } from "react";

const RatingStars = ({ user, book, handleVote }) => {
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
            className="star w-6 h-6 bg-yellow-500 hover:bg-yellow-300 cursor-pointer transition-all duration-200 hover:scale-110"
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
  const [resultsLibrary, setResultsLibrary] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [deleteComment, setDeleteComment] = useState(null);

  const bookId = localStorage.getItem("bookId");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();
      if (res) setUser(res.data.userFound);
    };
    fetchUser();

    const fetchBook = async () => {
      const res = await getBook(bookId);
      if (res) setBook(res.data);
    };
    fetchBook();
  }, [resultsLibrary]);

  useEffect(() => {
    setResultsLibrary(
      user?.booksLibrary.some((obj) => Object.values(obj).includes(bookId)) 
    );
  },[resultsLibrary,user]);

  console.log(user?.booksLibrary);
  console.log(book);
  console.log(resultsLibrary);

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

  // Add book to user's library
  const handleAddBook = async (bookId) => {
    if (!user) return;
    try {
      await addBook({ bookId, userId: user._id });
    
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again later.");
    }
  };
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleEdit = (indice, text) => {
    setEditingIndex(indice);
    setEditedComment(text);
  };

  const handleRemove = (indice, text) => {
    book.comments.splice(indice, 1);
    book.idUserComments.splice(indice, 1);
    editBook(book._id, book).then(() => {
      setEditingIndex(null);
    });
    setDeleteComment(undefined);
  };
  const handleSave = () => {
    if (editingIndex !== null) {
      const updatedComments = [...book.comments];
      updatedComments[editingIndex].text = editedComment;
    }
    editBook(book._id, book).then(() => {
      setEditingIndex(null);
    });
  };

  return (
    <main className="w-screen flex justify-center px-4">
      {book && (
        <section className="max-w-4xl m-10 text-gray-100  ">
          <h2 className="text-3xl p-5 sm:text-3xl font-bold text-gray-100">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
          <div className="p-5 flex flex-col sm:flex-row gap-5">
            <div className="w-16 h-16 absolute mt-3 ml-3 z-10 bg-blue-800/50  rounded-full border-[3px] border-indigo-400 flex justify-center items-center">
              <p className="text-5xl text-indigo-200">{book.rating}</p>
            </div>
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              className="w-52 h-96 lg:max-w-sm  object-cover rounded shadow-lg"
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
              <div className="w-80">
                <span>Descripción :</span>
                <p>{book.description}</p>
              </div>
              {showChapters && (
                <ChaptersList
                  chapters={book.chapters}
                  toggleChapters={() => setShowChapters(false)}
                />
              )}
              <p>
                <span>Puntuación : </span>
                {book.rating}
              </p>
              <p>
                <span>Votos : </span>
                {book.idUserVote.length}
              </p>
              <div className="flex flex-col justify-start items-start gap-4">
                <p>
                  <span>Creado : </span>
                  {book.createdAt.slice(0, 10).split("-").reverse().join("-")}
                </p>

                <p>
                  <span>Modificado : </span>
                  {book.updatedAt.slice(0, 10).split("-").reverse().join("-")}
                </p>
                <div className="flex gap-5 my-2">
                  <button
                    onClick={() => handleNavigate("/readBook", book._id)}
                    className="text-white w-16 border border-indigo-400 rounded-lg text-2xs text-center"
                  >
                    Leer
                  </button>
                  {user ? (
                    !   user?.booksLibrary.some((obj) => Object.values(obj).includes(bookId))  ? (
                      <button
                        onClick={() => {handleAddBook(book._id), setResultsLibrary(true)}}
                        className="text-white w-24 border border-indigo-400 rounded-lg text-2xs text-center"
                      >
                        + Blilioteca
                      </button>
                    ) : (
                      <h3>En tu biblioteca</h3>
                    )
                  ) : null}
                </div>

                {user &&
                !book.idUserComments.includes(user?._id) &&
                !user?.books.some((obj) =>
                  Object.values(obj).includes(bookId)
                ) ? (
                  <button
                    onClick={() => {
                      localStorage.setItem("token", user._id),
                        navigate("/writingComments");
                    }}
                  >
                    Añadir comentario
                  </button>
                ) : null}
              </div>

              <RatingStars
                user={user}
                book={book}
                handleVote={handleVote}
                handleOver={handleMouseOver}
                handleOut={handleMouseOut}
              />
            </div>
          </div>
          {book.comments.length > 0 ? (
            <div className="flex flex-col gap-3 px-2">
              <h3>Comentarios</h3>
              <div className="w-80 sm:w-[92%]  h-[1px] bg-gradient-to-r from-orange-500 via-orange-500 to-orange-500/0 "></div>
              {book.comments.map((comentarios, indice) => (
                <div key={indice} className="bg-indigo-400/50 rounded-lg p-3">
                  <p>
                    {comentarios.user} {comentarios.lastName}
                  </p>
                  {editingIndex === indice ? (
                    <>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                      />
                      <button onClick={() => handleSave(indice)}>
                        Guardar
                      </button>
                    </>
                  ) : (
                    <p>{comentarios.text}</p>
                  )}
                  <div className="flex">
                    <p>{comentarios.update.month}&nbsp;/&nbsp;</p>
                    <p>{comentarios.update.year}</p>
                  </div>
                  {comentarios.userId === user?._id && (
                    <div className="flex gap-5">
                      <button
                        onClick={() => handleEdit(indice, comentarios.text)}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemove(indice, comentarios.text)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
}
