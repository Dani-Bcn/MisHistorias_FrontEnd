import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import  terror from "/images/escena-castillo-cuadro.jpeg"

export default function ReadBook() {
  const [bookId, setBookId] = useState(localStorage.getItem("bookId"));
  const [book, setBook] = useState();

  const handleBooks = async () => {
    const res = await getBook(bookId);
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    handleBooks();
  }, []);
book?console.log(book):null
  return (
    book?
    <main 
    className={`w-screen text-orange-950  flex justify-center items-center bg-cover  bg-[url("${book.imageUrl}")]`}>
      <section className="w-10/12 mt-40  backdrop-blur-md brightness-150">

      <h3 className="bg-slate-400/75 text-7xl p-10">{book.title}</h3>
      
        { book ? book.chapters.map((e, i) => {
          return (
            <div
            className="w-
            
            full bg-slate-400/75 m-auto text-3xl p-10 whitespace-pre-wrap"
            key={i}>
              <h4 className="text-5xl font-bold py-10">{e.title}</h4>
              <div className="flex justify-center">
              <h4 className="text-7xl font-bold -mt-7">{e.text.slice(0,1)}</h4>
              <h4>{e.text.slice(1)}</h4>
              </div>
            </div>  
          );
        }):null}
      </section>
    </main>:null
  );
}
