import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { arrayGenres } from "../components/Images_Genres";
import { useNavigate } from "react-router-dom";

export default function PageBook() {
  const navigate = useNavigate();
  const [book, setBook] = useState();
  const [bookId, setBookId] = useState(localStorage.getItem("bookId"));
  let image;

  const searchBook = async () => {
    console.log(bookId);
    const res = await getBook(bookId);
    res ? setBook(res.data) : null;
  };

  if (book) {
    image = arrayGenres.find((element) => element.genre === book.genre);
  }
  console.log(book);
  useEffect(() => {
    searchBook();
  }, []);
  let readingTime =0
book?
  book.chapters.map((e,i)=>{
    readingTime = readingTime + e.text.split(" ").length / 300
    
  })
:null

console.log(readingTime)
  return (
    <main className=" w-screen flex justify-center">
      {book ? (
        <section
          className="grid  text-5xl w-[96vw] h-[120vh] my-20 px-10 py-20
     grid-cols-4 gap-4
     grid-rows-9 
     bg-slate-900/25
     ;"
        >
          <h2 className="grid text-orange-600  h-20 col-start-1 col-end-5 place-content-center">
            {book.title}
          </h2>

          <div className="grid col-start-1 my-5  ">
            <div className="flex gap-5">
              <h4>{book.dataUser.userName}</h4>
              <h4 className="text-orange-700 font-bold">
                {book.dataUser.lastName}
              </h4>
            </div>
          </div>
          <img
            src={book.imageUrl}
            alt=""
            className="grid row-start-3 row-end-4 w-72"
          />

          <div className="text-3xl grid row-start-3 col-start-2 col-span-3">
            <div className="flex justify-between w- bg-indigo-400/25 p-2">
              <h4> Género : </h4>
              <h4 className="text-orange-700 font-bold">{book.genre}</h4>
            </div>
            <div className="flex justify-between  p-2">
              <h4> Tiempo de lectura:</h4>
              <h4 className="text-orange-700 font-bold">2h</h4>
            </div>
            <div className="flex justify-between w- bg-indigo-400/25 p-2">
              <h4> Capíulos:</h4>
              <h4 className="text-orange-700 font-bold">
                {book.chapters.length}
              </h4>
            </div>
            <div className="flex justify-between  p-2">
              <h4> Fecha de creación:</h4>
              <h4 className="text-orange-700 font-bold">
                {book.createdAt.slice(0, 10).split("-").reverse().join("/")}
              </h4>
            </div>
            <div className="flex justify-between bg-indigo-400/25 p-2">
              <h4> Actualizado:</h4>
              <h4 className="text-orange-700 font-bold ">
                {book.updatedAt.slice(0, 10).split("-").reverse().join("/")}
              </h4>
            </div>
            <h4
              className="w-40 text-3xl cursor-pointer text-center font-bold bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all my-10 "
              onClick={() => {
                localStorage.setItem("bookId", book._id), navigate("/readBook");
              }}
            >   
              Leer
            </h4>
          </div>
          <div className="grid row-start-9 col-start-1 col-span-9 text-2xl ">
            <div className="flex text-orange-700">
            <h4 className="text-5xl font-extrabold -mt-4 ">{book.description.slice(0, 1)}</h4>
            <h4>{book.description.slice(1)}</h4>
            </div>
          </div>   
        </section>   
      ) : null}
    </main>
  );
}
