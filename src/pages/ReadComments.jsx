import React, { useEffect, useState } from "react";
import { getBook } from "../api/auth";
import { editUser, profile, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ReadComments() {
  const [book, setBook] = useState();
  const [user, setUser] = useState();
  const [activeEdit, setActiveEdit] = useState(false);
  const navigate = useNavigate();

  const getUser = async () => {
    const res = await profile();
    setUser(res.data.userFound);
  };

  const searchBook = async () => {
    const res = await getBook(localStorage.getItem("bookId"));
    res ? setBook(res.data) : null;
  };

  useEffect(() => {
    getUser();
    searchBook();
  }, []);

  let editText;

  const [activeButton, setActiveButton] = useState();

  const handleChange = (e) => {
    editText = e.target.value;
    editText.length > 5 ? setActiveButton(true) : null;
   
  };

  const handleSubmit = (i) => {
    book.comments[i].text = editText;
    book ? editBook(book._id, book) : null;
    setTimeout(() => {
      location.reload();
    }, 100);
  };

  return (
    <main className="w-screen flex">
      <section className=" w-full flex flex-col flex-wrap items-center mt-20 text-white text-4xl">
        {book ? (
          <h2 className="text-6xl mb-10">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        ) : null}
        <h3>
          <span>C</span>omentarios
        </h3>
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
                    <div className="flex text-xl gap-2">
                      <p>{e.update.day} </p>
                      <p>/</p>
                      <p>{e.update.month} </p>
                      <p>/</p>
                      <p>{e.update.year}</p>
                      {user ? (
                        book.idUserComments[i] === user._id ? (
                          <div type="submit" className="flex w-96">
                            <button
                              onClick={() => setActiveEdit(true)}
                              className="btn text-xl mx-20 bg-slate-600 rounded-md px-5"
                            >
                              <span>E</span>ditar
                            </button>
                            <div>
                              {activeEdit ? (
                                <div className="absolute w-[450px] h-60 bg-slate-800 mx-20 rounded-md -mt-44 flex flex-col items-center gap-5">
                                  <textarea
                                    placeholder="Escribe aquí tu comentario."
                                    className="rounded-md h-40 w-[95%] mt-5 "
                                    type="text"
                                    onChange={(e) => handleChange(e)}
                                  />
                                  <div className="flex w-[80%] justify-center gap-10">
                                    <div
                                      className=" text-3xl font-black hover:text-red-600 transition-all cursor-pointer"
                                      onClick={() => {
                                        setActiveEdit(false), location.reload();
                                      }}
                                    >
                                      X
                                    </div>
                                    {activeButton ? (
                                      <div
                                        className="text-3xl font-black hover:text-green-600 transition-all cursor-pointer"
                                        onClick={() => {
                                          handleSubmit(i);
                                        }}
                                      >
                                        V
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null
                      ) : null}
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
