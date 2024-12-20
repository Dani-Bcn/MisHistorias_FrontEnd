import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import { profile } from "../api/auth";

export default function ReadBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [bookId, setBookId] = useState(localStorage.getItem("bookId"));
  const [book, setBook] = useState();
  const [acces, setAcces] = useState(false);
  const [user, setUser] = useState();

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  const handleBooks = async () => {
    const res = await getBook(bookId);
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    handleBooks();
    getUser()
  }, []);


  return book ? (
    <main className="relative text-white w-screen">
      <nav className="fixed -mt-12 ml-10 z-[100] ">
        <ul className="flex gap-5 text-xl">       
          <li onClick={() => navigate("/pageBook")}>
            <span className="font-bold">I</span>nfo
          </li>
          { user && book && user._id === book.dataUser.userId ? (
            <li onClick={() => navigate("/editBook")}>
              <span className="font-bold">E</span>ditar
            </li>
          ) : null}
        </ul>
      </nav>
      <section className="mt-16 p-5">
        {book && book.chapters.length > 0 ? (
          <div className="fixed w-72 bg-gradient-to-b flex flex-col  from-red-200/10 p-5 rounded-xl">
            <h3 className="text-xl border-b mb-3">
              <span>C</span>apítulos
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
                  <button className="w-80 text-[13px] text-start flex justify-start">
                    <span>{e.title[0]}</span>
                    {e.title.slice(1)}
                  </button>
                </Link>
              );
            })}
          </div>
        ) : null}
        <section className="flex flex-col justify-center items-center">
          <h3 className="text-6xl border-b my-10">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h3>
          {book
            ? book.chapters.map((e, i) => {
                return (
                  <div
                    id={e.title}
                    key={i}
                    className="flex flex-col rounded-xl w-[800px]"
                  >
                    <h3 className="text-4xl my-10">
                      <span>{e.title[0]}</span>
                      {e.title.slice(1)}
                    </h3>
                    <p id="pre" className="text-xl ml-10">
                      <span className="text-4xl font-bold">{e.text[0]}</span>
                      {e.text.slice(1)}
                    </p>
                  </div>
                );
              })
            : null}
        </section>
      </section>
    </main>
  ) : null;
}
