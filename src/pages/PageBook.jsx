import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { arrayGenres } from "../components/Images_Genres";
import { useNavigate } from "react-router-dom";

export default function PageBook() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [handleCahpters,setHandleChapters] = useState(false)
  const [book, setBook] = useState();
  const [bookId, setBookId] = useState(localStorage.getItem("bookId"));
  let image;

  const searchBook = async () => {
    const res = await getBook(bookId);
    res ? setBook(res.data) : null;
  };

  if (book) {
    image = arrayGenres.find((element) => element.genre === book.genre);
  }

  useEffect(() => {
    searchBook();
  }, []);
  let readingTime = 0;
  book
    ? book.chapters.map((e, i) => {
        readingTime = readingTime + e.text.split(" ").length / 300;
      })
    : null;
  book ? console.log(book) : null;
  return (
    <main className="w-screen flex justify-center">
      {book ? (
        <section className="m-24 text-6xl text-white">
          <h2 className="titles">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
          <div className="m-5 flex gap-3 text-2xl">
            <img
              src={book.imageUrl}
              alt="img-book"
              className="w-52 h-72 object-cover"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-5xl flex gap-3">
                <span>{book.dataUser.userName}</span>
                {book.dataUser.lastName}
              </h2>
              <p className="flex gap-3">
                <span>Género</span>
                {book.genre}
              </p>
              <p 
              onClick={()=>setHandleChapters(true)}
              className="flex gap-3">
                <span>Capítulos</span> {book.chapters.length}
              </p>
              {
                handleCahpters?
               book.chapters.map((e,i)=>{
                return(
                  <p>{e.title}</p>

                )
               })
                :null
              }
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
