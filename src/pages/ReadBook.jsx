import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

export default function ReadBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [bookId, setBookId] = useState(localStorage.getItem("bookId"));
  const [book, setBook] = useState();

  const handleBooks = async () => {
    const res = await getBook(bookId);
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    handleBooks();
  }, []);

  return book ? (
    <main className="relative text-white w-screen">
      <nav className="px-10 fixed br-red-200">
        <ul className="flex flex-col gap-10 ">
          <li onClick={() => navigate("/pageBook")}>
            <button className="my-5">
              <span>Info</span> Libro
            </button>
            {book && book.chapters.length > 0 ? (
              <div className="bg-gradient-to-r from-red-200/10 p-2 rounded-xl">
                <h3 className="text-xl border-b my-3">
                  <span>C</span>apitulos
                </h3>
                {book.chapters.map((e, i) => {
                  return (
                    <Link
                      key={i}
                      to={e.title}
                      spy={true}
                      smooth={true}
                      offset={-50}
                      duration={1000}
                    >
                      <button className="text-[12px] ">
                        <span>{e.title[0]}</span>
                        {e.title.slice(1)}
                      </button>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </li>
        </ul>
      </nav>
      <section className="my-10 flex flex-col justify-center items-center">
        <h3 className="text-6xl m-10 py-5 border-b">
          <span>{book.title[0]}</span>
          {book.title.slice(1)}
        </h3>
        <div className="ml-40">
          {book
            ? book.chapters.map((e, i) => {
                return (
                  <div
                    id={e.title}
                    key={i}
                    className="w-[800px] flex flex-col p-5 rounded-xl"
                  >
                    <h3 className="text-4xl">
                      <span>{e.title[0]}</span>
                      {e.title.slice(1)}
                    </h3>
                    <h4 className="text-xl px-10 py-5 ">{e.text}</h4>
                  </div>
                );
              })
            : null}
        </div>
      </section>
    </main>
  ) : null;
}
