import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { editBook } from "../api/auth";
import { editUser, profile } from "../api/auth";

export default function ReadComments() {
  const [book, setBook] = useState();
  const [user, setUser] = useState();

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  const searchBook = async () => {
    const res = await getBook(localStorage.getItem("bookId"));
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    getUser();
    searchBook();
  }, []);

  console.log(book);
  console.log(user);

  return (
    <main className="w-screen flex justify-center">
      <section className=" w-full flex flex-col flex-wrap items-center mt-20 text-white text-4xl">
        {book ? (
          <h2 className="text-6xl mb-10">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
         
        ) : null}
         <h3><span>C</span>omentarios</h3>
        <div className="w-full flex flex-wrap p-20 gap-20 ">
          {book
            ? book.comments.map((e, i) => {
                
                return (
                  <div
                    key={i}
                    className="w-96 p-5  flex flex-col gap-5 flex-wrap bg-slate-800/50 rounded-xl"
                  >
                    <h3 className="text-2xl">{e.user}</h3>
                    <p className="w-80 leading-5 text-[18px] flex flex-wrap overflow-auto bg-slate-600/50 rounded-md p-5">
                      {e.text}
                    </p>
                    <div className="flex gap-1 text-xl">
                      <p>{e.update.month} /</p>
                      <p>{e.update.year}</p>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </section>
    </main>
  );
}
