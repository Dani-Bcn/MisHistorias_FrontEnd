import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBook, editBook, profile, addBook } from "../api/auth";
import gsap from "gsap";

const RatingStars = ({ user, book, handleVote }) => {

  window.scrollTo(0, 0);
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
  <section className="absolute z-30 mt-5 max-w-xs rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-sm text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-sm sm:text-base">
    {chapters.map((chapter, index) => (
      <div key={index} className="flex items-center gap-2 py-1">
        <span className="w-6 text-center font-bold text-orange-200 sm:w-8">{index + 1}</span>
        <button className="text-sm text-indigo-200 hover:text-orange-200 sm:text-base">
          {chapter.title}
        </button>
      </div>
    ))}
    <button
      onClick={toggleChapters}
      className="mt-2 text-sm text-red-300 hover:text-red-200"
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
    <main className="page-shell">
      {book && (
        <section className="page-container">
          <h2 className="page-title">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
          <div className="section-card mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="relative mx-auto w-full max-w-[280px]">
              <div className="absolute left-4 top-4 z-10 flex h-20 w-20 items-center justify-center rounded-full border border-orange-300 bg-slate-950/80 shadow-xl shadow-black/40">
                <p className="text-3xl font-black text-orange-200">{book.rating}</p>
              </div>
              <img
                src={book.imageUrl}
                alt={`Cover of ${book.title}`}
                className="h-[430px] w-full rounded-3xl object-cover shadow-2xl shadow-black/40"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                <span>{book.dataUser.userName}</span> {book.dataUser.lastName}
              </h2>
              <p className="text-base text-slate-200 sm:text-lg">
                <span className="font-semibold">Género:</span> {book.genre}
              </p>
              <p className="text-base text-slate-200 sm:text-lg">
                <span className="font-semibold">Capítulos : </span>
                <span
                  className="cursor-pointer text-indigo-200 hover:text-orange-200"
                >
                  {book.chapters.length}
                </span>
              </p>
              <div className="glass-card p-5 text-slate-200">
                <span>Descripción :</span>
                <p className="mt-2 leading-7">{book.description}</p>
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
              <div className="flex flex-col items-start justify-start gap-4">
                <p>
                  <span>Creado : </span>
                  {book.createdAt.slice(0, 10).split("-").reverse().join("-")}
                </p>

                <p>
                  <span>Modificado : </span>
                  {book.updatedAt.slice(0, 10).split("-").reverse().join("-")}
                </p>
                <div className="my-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleNavigate("/readBook", book._id)}
                    className="btn-primary"
                  >
                    Leer
                  </button>
                  {user ? (
                    !   user?.booksLibrary.some((obj) => Object.values(obj).includes(bookId))  ? (
                      <button
                        onClick={() => {handleAddBook(book._id), setResultsLibrary(true)}}
                        className="btn-secondary"
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
                    className="btn-secondary"
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
            <div className="mt-8 flex flex-col gap-4 px-2">
              <h3 className="text-2xl font-bold">Comentarios</h3>
              <div className="divider-glow max-w-3xl"></div>
              {book.comments.map((comentarios, indice) => (
                <div key={indice} className="glass-card flex flex-col gap-3 p-5">
                  <p className="font-semibold text-indigo-100">
                    {comentarios.user} {comentarios.lastName}
                  </p>
                  {editingIndex === indice ? (
                    <>
                      <textarea
                        className="min-h-32 w-full"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                      />
                      <button 
                      onClick={() => handleSave(indice)}
                        className="btn-primary w-fit"
                      >
                        Guardar
                      </button>
                    </>
                  ) : (
                    <p className="leading-7 text-slate-200">{comentarios.text}</p>
                  )}
                  <div className="flex text-sm text-slate-400">
                    <p>{comentarios.update.month}&nbsp;/&nbsp;</p>
                    <p>{comentarios.update.year}</p>
                  </div>
                  {comentarios.userId === user?._id && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(indice, comentarios.text)}
                          className="btn-secondary"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemove(indice, comentarios.text)}
                          className="btn-danger"
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
