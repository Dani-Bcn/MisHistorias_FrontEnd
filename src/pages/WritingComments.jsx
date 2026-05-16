import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBook, editBook, profile } from "../api/auth";

export default function WritingComments() {
  window.scrollTo(0, 0);
  const [getText, setGetText] = useState("");
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [verifyText, setVerifyText] = useState(false);
  const navigate = useNavigate();

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();

  // Get user information
  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/allBooks");
      return;
    }
    const res = await profile();
    if (res) {
      setUser(res.data.userFound);
    }
  };

  // Fetch book details
  const searchBook = async () => {
    const bookId = localStorage.getItem("bookId");
    if (bookId) {
      const res = await getBook(bookId);
      if (res) {
        setBook(res.data);
      }
    }
  };

  // Run both getUser and searchBook once on component mount
  useEffect(() => {
    getUser();
    searchBook();
  }, []);

  // Prevents users who have already commented from accessing the page
  useEffect(() => {
    if (book && user && book.idUserComments.includes(user._id)) {
      navigate("/allBooks");
    }
  }, [book, user, navigate]);

  const handleClick = () => {
    if (getText.length < 5) {
      setVerifyText(true);
      return;
    }

    if (book && user) {
      book.idUserComments.push(user._id);
      book.comments.push({
        text: getText,
        user: user.userName,
        lastName: user.lastName,
        userId: user._id,
        update: { month, year, day },
      });

      editBook(book._id, book).then(() => {
        navigate("/pageBook");
      });
    }
  };

  return (
    <main className="page-shell flex justify-center">
      <section className="section-card flex w-full max-w-3xl flex-col items-center text-center text-white">
        <h3 className="py-5 text-xl">
          <span>E</span>scribe tu comentario sobre la obra de
        </h3>
        <h2 className="text-4xl font-bold">
          <span>{book?.title[0]}</span>
          {book?.title.slice(1)}
        </h2>

        <textarea
          id="cooc"
          value={getText}
          onChange={(e) => setGetText(e.target.value)}
          className="my-8 h-44 text-xl"
        />
        <button onClick={handleClick} className="btn-primary">
          Guardar
        </button>
        {verifyText && (
          <h3
            onClick={() => setVerifyText(false)}
            className="my-5 cursor-pointer rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-2 text-xl text-red-200"
          >
            El comentario debe tener un mínimo de 5 carácteres
          </h3>
        )}
      </section>
    </main>
  );
}
