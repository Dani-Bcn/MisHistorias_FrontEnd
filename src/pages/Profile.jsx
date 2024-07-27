import React, { useEffect, useState } from "react";
import { profile, deleteBooks, editUser, getIdUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { split } from "postcss/lib/list";

export default function Profile() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [getBook, setGetBook] = useState();
  const [handleDelete, setHandeDelete] = useState(false);
  const [numDeleteBook, setNumDeleteBook] = useState();
  const [verifyDelete, setVerifyDelete] = useState({
    state: false,
    idBook: "",
  });

  const getUser = async () => {
    const res = await profile();
    res ? setUser(res.data.userFound) : null;
  };

  useEffect(() => {
    getUser();
  }, []);

  const removeBook = (book) => {
    user.books.map((books, i) => {
      if (books._id === books) {
        user.books.splice(i, 1);
        location.reload();
      }
    });
    deleteBooks(book);
  };

  const deleteBookLibrary = (e) => {
    user.data.userFound.booksLibrary.map((books, i) => {
      if (books._id === e) {
        user.data.userFound.booksLibrary.splice(i, 1);
        editUser(user._id, user.data.userFound);
        location.reload();
      }
    });
  };

  return (
    <main className="w-screen flex flex-col gap-10 justify-center items-center">
      {user ? (
        <section className="relative flex  flex-col  justify-center  items-center mt-32">
          <div className="absolute w-72 h-72 -mx-5 -mt-5 bg-green-400/[0.5] blur-xl shadow-[0px_0px_20px] shadow-black  rounded-3xl rotate-45"></div>
          <div className="absolute w-72 h-72 -mx-5 -mt-5  bg-blue-400/[0.3] blur-xl shadow-[0px_0px_10px] shadow-black  rounded-3xl  scale-[1.2] rotate-45"></div>
          <div className="relative -mt-20 py-5 flex gap-2 text-5xl text-white">
            <span>
              <h2 className="font-bold">{user.userName}</h2>
            </span>
            <h2>{user.lastName}</h2>
          </div>
          <img
            src={user.imageUserUrl}
            alt={user.userName}
            className="relative w-60 h-60 border-8 object-cover object-top border-orange-400 rounded-full "
          />

          <div className="relative flex  gap-72 justify-center items-center  text-white z-10">
            <button
              className="btn px-[38px!important] "
              onClick={() => navigate("/editUser")}
            >
              Editar perfil
            </button>
            <button className="btn px-[16px!important] " onClick={() => navigate("/createBook")}>
              Crea una historia
            </button>
          </div>
          <div></div>
        </section>
      ) : null}
      <section className="w-full pr-40 pl-20 items-center">
        <h2 className="text-3xl font-bold text-white my-5">
          <span>Mis</span> Historias
        </h2>
        <div className="flex flex-wrap justify-between">
          {user
            ? user.books.map((book, i) => {
                return (
                  <div key={i} className="w-60 flex flex-col text-white">
                    <div className="w-full relative">
                      <h2 className="text-2xl font-semibold">
                        <span>{book.title[0]}</span>
                        {book.title.slice(1)}
                      </h2>
                      <div className="flex">
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="w-52 h-72 "
                        />
                        <div className="m-5 flex flex-col gap-2">
                          <button
                            className="w-16 btn flex justify-start"
                            onClick={() => {
                              localStorage.setItem("bookId", book._id),
                                navigate("/editBook");
                            }}
                          >
                            Editar
                          </button>
                          <button
                           className="btn w-12 flex justify-start"
                            onClick={() => {
                              localStorage.setItem("bookId", book._id),
                                navigate("/readBook");
                            }}
                          >
                            Leer
                          </button>
                          <button
                           className="btn  w-10 flex justify-start"
                            onClick={() => {
                              localStorage.setItem("bookId", book._id);
                              navigate("/PageBook");
                            }}
                          >
                            Ver
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHandeDelete(true), setNumDeleteBook(i);
                            }}
                           className="btn w-28 flex justify-start" 
                          >
                            Eliminar libro
                          </button>
                          {handleDelete && numDeleteBook === i ? (
                            <div className="text-red-600">
                              <h3>Confirma que quieres eliminar el libro</h3>
                              <div className="w-full flex gap-10">
                                <button
                                  className="text-[rgb(0,255,0)!important] bg-[rgb(0,125,255)!important] btn"
                                  onClick={() => {
                                    removeBook(book._id), location.reload();
                                  }}
                                >
                                  V
                                </button>

                                <button
                                  onClick={() => setHandeDelete(false)}
                                  className="text-[rgb(255,0,0)!important] bg-[rgb(0,125,255)!important] btn"
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </section>
      <section className="w-[95vw] pl-10">
        <h2 className="text-3xl font-bold text-white my-5">
          <span>Mi</span> Biblioteca
        </h2>
        <div className="flex gap-10">
          {user
            ? user.booksLibrary.map((e, i) => {
                return (
                  <div key={i} className="flex">
                    <div className="flex flex-col">
                      <img
                        src={e.imageUrl}
                        alt={e.title}
                        className="w-52 h-72"
                      />
                      <h2>{e.title}</h2>
                      <div>
                        <div>
                          <h3>{e.dataUser.userName}</h3>
                          <h3>{e.dataUser.lastName}</h3>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3
                        onClick={() => {
                          localStorage.setItem("bookId", e._id),
                            navigate("/readBook");
                        }}
                      >
                        Leer
                      </h3>
                      <button
                        onClick={() => {
                          localStorage.setItem("bookId", e._id);
                          navigate("/PageBook");
                        }}
                      >
                        Ver
                      </button>
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
