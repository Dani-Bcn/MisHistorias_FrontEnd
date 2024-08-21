import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBook } from "../api/auth";
import { editBook } from "../api/auth";
import { editUser, profile } from "../api/auth";

export default function WritingComments() {
  const [getText, setGetText] = useState();
  const [book, setBook] = useState();
  const [user, setUser] = useState();
  const date = new Date();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  const [verifyText, setVerifyText] = useState(false);
  const navigate = useNavigate();

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  const searchBook = async () => {
    const res = await getBook(localStorage.getItem("bookId"));
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    console.log(book,user)
    getUser();
    searchBook();
  }, []);

  const handleClick = (e) => {
    if (getText.length < 10) {
      setVerifyText(true);
    } else {
      book.idUserComments.push(user._id);
      book.comments.push({
        text: getText,
        user: user.userName,
        userId: user._id,
        update: { month: month + 1, year: year, day: day },
      });
      book ? editBook(book._id, book) : null;
      navigate("/pageBook");
      setTimeout(() => {
        location.reload();
      }, 150);
    }
  };

  return (
    <main className="w-screen flex justify-center">
      <section className=" w-full flex  flex-col items-center mt-40 text-white text-4xl">
        <h2>
          <span>E</span>scribe tu comentario
        </h2>
        <textarea
          id="cooc"
          onChange={(e) => {
            setGetText((prev) => (prev = e.target.value));
          }}
          className="w-96 h-60 my-10 text-xl rounded-md"
        ></textarea>
        <button onClick={() => handleClick(getText)} className="text-xl">
          Guardar comentario
        </button>
        {verifyText ? (
          <h3
            onClick={() => setVerifyText(false)}
            className="text-red-600 text-xl my-5 cursor-pointer"
          >
            El comentario debe tener un mínimo de 10 carácteres
          </h3>
        ) : null}
      </section>
    </main>
  );
}
