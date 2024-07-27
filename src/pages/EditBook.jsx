import React, { useEffect, useState } from "react";
import { savePage, getBook, editBook } from "../api/auth";
import { Navigate, useNavigate } from "react-router-dom";

export default function EditBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [book, setBook] = useState();
  const [verifyField, setVerifyField] = useState(false);

  const handleBooks = async () => {
    const res = await getBook(localStorage.getItem("bookId"));
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    handleBooks();
  }, []);

  book && book.chapters
    ? book.chapters.map((e, i) => {
        console.log(e.title);
        e.title === "" ? navigate("/writingPage") : null;
      })
    : null;

  const handleAddChapter = (e) => {
    book.chapters.push({
      title: "",
      text: "",
    });
    book ? editBook(book._id, book) : null;
    localStorage.setItem("numChapter", e);
    navigate("/writingPage");
  };

  return (
    <main className="absolute overflow-x-hidden w-[98.5vw] h-screen ">
      <section className="relative w-full h-fulll px-20 mt-20">
      <div className="fixed w-[300px] h-[300px] ml-[500px] rounded-full  bg-blue-600/5 mt-[70px] blur-xl"></div>
      <div className="fixed w-[300px] h-[300px] mt-20 ml-60 rounded-full  bg-red-600/10 ]  blur-xl"></div>
      <div className="fixed w-[350px] h-[450px] mt-20 -ml-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>
        {book && book.title ? (
          <h2 className="relative h-16 text-white text-5xl">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        ) : null}

        {book && book.chapters.length !== 0 ? (
          <div className=" relative w-[44vw] h-14 flex justify-between items-center text-white bg-gradient-to-r p-5 rounded-3xl from-orange-600/[0.5]">
            <h3 className="w-20   border-r border-orange-500">Capítulos</h3>
            <h3 className="w-72  border-r border-orange-500 ">Títulos</h3>
            <h3>Última actulización </h3>
          </div>
        ) : null}
        {book
          ? book.chapters.map((e, i) => {
              return (
                <section key={i}>
                  <div
                    key={i}
                    className="relative w-[60vw] h-14 flex  justify-between items-center text-white bg-gradient-to-r px-5  my-5 rounded-3xl from-slate-600/[0.5]"
                  >
                    <h3 className="w-20  border-r border-orange-500">{`#${
                      i + 1
                    }`}</h3>
                    <h3 className="w-72 flex  justify-start items-start text-center  border-r border-orange-500">
                      {e.title}
                    </h3>
                    <h3 className="w-52">
                      {book.updatedAt
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")}
                    </h3>
                    <button
                      onClick={() => {
                        localStorage.setItem("numChapter", i + 1),
                          navigate("/writingPage");
                      }}
                      className="btn w-20"
                    >
                      Editar
                    </button>
                  </div>
                </section>
              );
            })
          : null}
        {book ? (
          <div className="relative flex items-center gap-10 h-20 ">
            <button
              onClick={() => handleAddChapter(book.chapters.length + 1)}
              className="btn"
            >
              Añadir Capitulo
            </button>
            <button
              onClick={() => {
                navigate("/pageBook");
              }}
              className="btn"
            >
              Ver libro
            </button>
            <button
              onClick={() => {
                navigate("/readBook");
              }}
              className="btn"
            >
              Leer libro
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
