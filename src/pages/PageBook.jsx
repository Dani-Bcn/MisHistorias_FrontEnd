import React, { useEffect, useState } from "react";
import { arrayGenres } from "../components/Images_Genres";
import { useNavigate } from "react-router-dom";
import { getBook, editBook, profile } from "../api/auth";
import gsap from "gsap";

export default function PageBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [handleChapters, setHandleChapters] = useState(false);
  const [book, setBook] = useState(null);
  const [bookId, setBookId] = useState(localStorage.getItem("bookId"));
  const [messageVote, setMessageVote] = useState(false);
  const [user, setUser] = useState(null);
  const [state, setState] = useState(false);

  const getUser = async () => {
    const res = await profile();
    if (res) setUser(res.data.userFound);
  };

  useEffect(() => {
    getUser();
  }, []);

  const searchBook = async () => {
    const res = await getBook(bookId);
    if (res) setBook(res.data);
  };

  useEffect(() => {
    searchBook();
  }, [bookId]);

  let image;
  if (book) {
    image = arrayGenres.find((element) => element.genre === book.genre);
  }

  const readingTime = book?.chapters.reduce((acc, e) => acc + e.text.split(" ").length / 300, 0);

  const [numLetters, setNumLetters] = useState(0);

  useEffect(() => {
    if (book) {
      const totalLetters = book.chapters.reduce((acc, e) => acc + e.text.length, 0);
      setNumLetters(totalLetters);
    }
  }, [book]);

  const start = [
    { num: 1, text: "uno" },
    { num: 2, text: "dos" },
    { num: 3, text: "tres" },
    { num: 4, text: "cuatro" },
    { num: 5, text: "cinco" },
    { num: 6, text: "seis" },
    { num: 7, text: "siete" },
    { num: 8, text: "ocho" },
    { num: 9, text: "nueve" },
    { num: 10, text: "diez" },
  ];

  const handleOver = (e) => {
    gsap.to(`#${e.text}`, {
      background: "rgb(255,115,0)",
    });
  };

  const handleOut = (e) => {
    gsap.to(`#${e.text}`, {
      background: "rgb(255,255,255)",
    });
  };

  const handleVote = (e) => {
    if (!book.idUserVote.includes(user._id)) {
      book.idUserVote.push(user._id);
      book.numVotes += 1;
      book.reCountVotes += e.num;
      book.rating = (book.reCountVotes / book.numVotes).toFixed(1);

      editBook(book._id, book);
      setState(!state);
    } else {
      setMessageVote(true);
    }
  };

  return (
    <main className="w-screen flex justify-center">
      {book && (
        <section className="m-24 text-6xl text-white">
          <h2 className="titles">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
          <div className="m-5 flex gap-3 text-2xl">
            <img
              src={book.imageUrl}
              alt="img-book"
              className="w-60 h-96 object-cover"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-5xl flex gap-3">
                <span>{book.dataUser.userName}</span>
                {book.dataUser.lastName}
              </h2>
              <h3>
                <span className="font-semibold">P</span>untuación {book.rating}
              </h3>
              <p>
                <span className="font-semibold">G</span>énero &nbsp;
                {book.genre}
              </p>
              <p
                onClick={() => setHandleChapters(!handleChapters)}
                className="w-26 text-2xl cursor-pointer hover:text-orange-600 transiton-all duration-[.5s] "
              >
                <span className="font-semibold ">C</span>apítulos &nbsp;
                {book.chapters.length}
              </p>
              {handleChapters && (
                <section className="absolute h-40 mt-20 ml-80 text-xl">
                  {book.chapters.map((e, i) => (
                    <div key={i} className="flex justify-start">
                      <span className="flex justify-center w-10">{i + 1}</span>
                      <button className="btn cursor-pointer">{e.title}</button>
                    </div>
                  ))}
                </section>
              )}
              <button
                onClick={() => navigate("/readBook")}
                className="text-2xl p-0 m-0 w-12"
              >
                <span>L</span>eer
              </button>
              {book.comments.length > 0 && (
                <button
                  onClick={() => navigate("/readComments")}
                  className="text-2xl w-40"
                >
                  <span>C</span>omentarios {book.comments.length}
                </button>
              )}
              {user &&
                book &&
                !book.idUserComments.includes(user._id) &&
                book.dataUser.userId !== user._id && (
                  <button
                    onClick={() => navigate("/writingComments")}
                    className="text-2xl p-0 m-0 w-52"
                  >
                    <span>A</span>ñadir comentario
                  </button>
                )}

              <div className="flex gap-1">
                {user &&
                  book.dataUser.userId !== user._id &&
                  !book.idUserVote.includes(user._id) &&
                  start.map((e) => (
                    <div
                      key={e.text}
                      id={e.text}
                      onClick={() => handleVote(e)}
                      onMouseOver={() => handleOver(e)}
                      onMouseOut={() => handleOut(e)}
                      className="star w-5 h-5 bg-white cursor-pointer"
                    />
                  ))}
              </div>
              {messageVote && (
                <div
                  onClick={() => setMessageVote(false)}
                  className="relative h-5 flex flex-col gap-5 text-[15px] text-red-600 cursor-pointer"
                >
                  You have already voted.
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

