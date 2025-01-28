import React, { useEffect, useState } from "react";
import { getBook, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

export default function ReadBook() {
  const navigate = useNavigate();
  const [bookId] = useState(localStorage.getItem("bookId"));
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndBook = async () => {
      try {
        const [userRes, bookRes] = await Promise.all([profile(), getBook(bookId)]);
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
    <section className="mt-20 w-screen p-5 flex flex-col lg:flex-row gap-5">
    
    <nav className="fixed text-red-50 top-0 left-0 w-full bg-gray-800 bg-opacity-90 z-50 p-4 mt-12">
        <ul className="flex gap-5 justify-center text-xl">
          <li
            onClick={() => navigate("/pageBook")}
            className="cursor-pointer hover:underline"
          >
            <span className="font-bold">I</span>nfo
          </li>
          {user && user._id === book.dataUser?.userId && (
            <li
              onClick={() => navigate("/editBook")}
              className="cursor-pointer hover:underline"
            >
              <span className="font-bold">E</span>ditar
            </li>
          )}
        </ul>
      </nav>
    {book.chapters?.length > 0 && (
      <aside className="text-red-50 lg:w-56 w-full bg-gray-800 bg-opacity-70 rounded-xl p-5 lg:fixed lg:top-20 mt-10">
        <h3 className="text-xl border-b border-gray-500 mb-3">
          <span>C</span>apítulos
        </h3>
        <ul className="flex flex-col gap-3">
          {book.chapters.map((chapter, i) => (
            <Link
              key={i}
              to={chapter.title}
              spy
              smooth
              offset={-150}
              duration={500}
              className="cursor-pointer text-start text-sm hover:text-gray-300"
            >
              {chapter.title}
            </Link>
          ))}
        </ul>
      </aside>
    )}

    <div className="lg:w-2/4 w-full mx-auto text-red-50">
      <h3 className="text-4xl text-center border-b border-gray-500 my-10">
        {book.title}
      </h3>
      {book.chapters?.map((chapter, i) => (
        <article
          id={chapter.title}
          key={i}
          className="bg-gray-800 bg-opacity-70 rounded-xl p-5 mb-10"
        >
          <h4 className="text-3xl mb-5">{chapter.title}</h4>
          <p className="text-lg leading-relaxed">
            <span className="text-2xl font-bold">{chapter.text[0]}</span>
            {chapter.text.slice(1)}
          </p>
        </article>
      ))}
    </div>
  </section>
  
  );
}
