import React, { useEffect, useState } from "react";
import { savePage, getBook, editBook } from "../api/auth";
import { Navigate, useNavigate } from "react-router-dom";

export default function EditBook() {
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

  const handleAddChapter = (e) => {
    console.log(e);

    book.chapters.push({
      title: "",
      text: "",
    });
    book ? editBook(book._id, book) : null;
    localStorage.setItem("numChapter", e);
    navigate("/writingPage");
  };

  return (
    <main className="w-screen h-screen relative ">
      {book ? (
        <img src={book.imageUrl} alt="" className="w-screen h-[100%] object-cover blur-md -mt-40 absolute z-[-1]" />
      ) : null}

    <div>
        {book ? <h2 className="text-white text-4xl">{book.title}</h2> : null}
       
          {book ? (
            <button
              onClick={() => handleAddChapter(book.chapters.length + 1)}
              className="text-2xl px-5 py-3 my-5 bg-orange-400 hover:bg-slate-900 text-slate-900 hover:text-orange-400 rounded-md transition-all"
            >
              Añadir Capitulo
            </button>
          ) : null}
          <tr className="w-full h-10 my-5 flex gap-2 text-2xl  bg-orange-400 items-center justify-center  ">
            <th className="text-center  flex justify-center items-center w-24 mx-5">
              Capítulo
            </th>
            <th className="text-center   ">
              Título
            </th>
            <th className=" w-96 " >Contenido</th>
            <th className="  w-96  ">Última actulización </th>
          </tr>
          {book
            ? book.chapters.map((e, i) => {
                console.log(e);
                return (
                  <tbody key={i}>
                    <tr
                      key={i}
                      className=" flex gap-10 h-32   "
                    >
                      <th className={`flex  text-black my-1 bg-indigo-400   justify-center items-center w-32`}>{`#${
                        i + 1
                      }`}</th>
                      <th
                        onClick={() => {
                          localStorage.setItem("numChapter", i + 1),
                            navigate("/writingPage");
                        }}
                        className="flex  m-1  text-black justify-center items-center cursor-pointer"
                      >
                        {e.title}
                      </th>
                      <th                       
                        onClick={() => {
                          localStorage.setItem("numChapter", i + 1),
                            navigate("/writingPage");
                        }}
                        className="flex justify-center text-black pr-10 items-center border-r-2 border-slate-950 w-96 cursor-pointer"
                      >
                        {e.text.slice(0, 40) + "..."}
                      </th>
                      <th>
                        {book.updatedAt
                          .slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("/")}
                      </th>
                    </tr>
                  </tbody>
                );
              })
            : null}
        
        </div>
    </main>
  );
}
