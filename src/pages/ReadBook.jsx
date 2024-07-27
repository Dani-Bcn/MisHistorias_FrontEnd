import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ReadBook() {

  window.scrollTo(0, 0);
  const navigate = useNavigate()
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
     <nav className="px-10 py-40 fixed br-red-200">
      <ul className="flex flex-col gap-10">
        <li onClick={()=>navigate("/pageBook")}><button>Info Libro</button></li>
        <li onClick={()=>navigate("/editBook")}><button>Editar Libro</button></li>
      </ul>
     </nav>
      <section className="my-40 mx-52 flex flex-col justify-center items-center">
        <h3 className="text-6xl m-10 py-5 border-b">
          <span>{book.title[0]}</span>
          {book.title.slice(1)}
        </h3>
        <div className="absolute w-[70vw] h-full blur-[2px] m-10  rotate-[2deg] border border-red-600"></div>
        <div className="absolute w-[70vw] h-full blur-[2px]   rotate-[-2deg] border border-green-600"></div>
        <div className="absolute w-[70vw] h-full blur-[2px]   rotate-[-4deg] border border-blue-600"></div>
        <div className="absolute w-[70vw] h-full blur-[2px]   rotate-[4deg] border border-orange-600"></div>
            {book
          ? book.chapters.map((e, i) => {
              return (
                <div key={i} className="w-[800px] flex flex-col">                 
                  <h3 className="text-4xl  pt-10">
                    <span>{e.title[0]}</span>
                    {e.title.slice(1)}{" "}
                  </h3>
                  <h4 className="text-xl p-20 ">{e.text}</h4>
                </div>
              );
            })
          : null}
      </section>
   
    </main>
  ) : null;
}
