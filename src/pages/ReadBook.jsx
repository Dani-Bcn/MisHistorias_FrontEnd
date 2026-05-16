import React, { useEffect, useState } from "react";
import { getBook, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ReadBook() {
  const navigate = useNavigate();
  const [bookId] = useState(localStorage.getItem("bookId"));
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndBook = async () => {
      try {
        const [userRes, bookRes] = await Promise.all([
          profile(),
          getBook(bookId),
        ]);
        if (userRes?.data?.userFound) {
          setUser(userRes.data.userFound);
        }
        if (bookRes?.data) {
          setBook(bookRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndBook();
    window.scrollTo(0, 0); // Scroll to top on page load
  }, [bookId]);

  if (!book) return null;


  return (
    <main className="page-shell flex flex-col items-center gap-8 text-white">
      <header className="page-container section-card flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-semibold xl:text-5xl">
          <span>{book?.dataUser.userName} </span>
          {book?.dataUser.lastName}
        </h2>
        <img
          src={book?.dataUser.imageUserUrl}
          alt="User"
          className="h-20 w-20 cursor-pointer rounded-full border-2 border-orange-300 object-cover shadow-lg shadow-orange-500/20 xl:h-32 xl:w-32"
        />
        <h3 className="page-title my-2">
          <span>{book.title[0]}</span>
          {book.title.slice(1)}
        </h3>
        <div className="divider-glow max-w-3xl"></div>
        <div className="max-w-3xl p-2 text-left">
          <h3 className="mb-2 font-semibold">
            <span>Descripción :</span>
          </h3>
          <p className="leading-7 text-slate-200">{book.description}</p>
        </div>
      </header>
      <div className="divider-glow page-container"></div>

      <div className="mx-auto w-full max-w-3xl text-red-50">
        {book.chapters?.map((chapter, i) => (


          i < book.chaptersPublished &&
          
          <article
            id={chapter.title}
            key={i}
            className="section-card mb-8"
          >
            <h4 className="mb-5 text-3xl font-bold">
              <span>{chapter.title[0]}</span>
              {chapter.title.slice(1)}
            </h4>
            <p className="text-lg leading-8 text-slate-100">
              <span className="text-2xl font-bold">{chapter.text[0]}</span>
              {chapter.text.slice(1)}
            </p>
          </article>
        ))}

     
        <button
          className="btn-secondary"
          onClick={() => navigate("/pageBook")}
        >
          Info
        </button>
      </div>
    </main>
  );
}
