import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBook, editBook, profile } from "../api/auth";

export default function WritingComments() {
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
        userId: user._id,
        update: { month, year, day },
      });
      
      editBook(book._id, book).then(() => {
        navigate("/pageBook");
      });
    }
  };

  return (
    <main className="w-screen flex justify-center">
      <section className="w-full flex flex-col items-center mt-40 text-white text-4xl">
        <h2>
          <span>E</span>scribe tu comentario
        </h2>
        <textarea
          id="cooc"
          value={getText}
          onChange={(e) => setGetText(e.target.value)}
          className="w-96 h-60 my-10 text-xl rounded-md"
        />
        <button onClick={handleClick} className="text-xl">
          Guardar comentario
        </button>
        {verifyText && (
          <h3
            onClick={() => setVerifyText(false)}
            className="text-red-600 text-xl my-5 cursor-pointer"
          >
            El comentario debe tener un mínimo de 5 carácteres
          </h3>
        )}
      </section>
    </main>
  );
}
