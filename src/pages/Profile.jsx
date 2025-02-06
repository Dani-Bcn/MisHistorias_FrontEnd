import React, { useEffect, useState } from "react";
import {
  profile,
  deleteBooks,
  deleteImg,
  removeBookLibrary,
  editBook,
} from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  /*  window.scrollTo(0, 0) */

  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [handleDelete, setHandeDelete] = useState(false);
  const [numDeleteBook, setNumDeleteBook] = useState();

  const getUser = async () => {
    const res = await profile();

    if (res && res.data.userFound) {
      setUser(res.data.userFound);
    } else {
      navigate("/allBooks");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const removeImg = async (values) => {
    await deleteImg({ imgLibro: values });
  };

  const handlePublish = (book) => {
    book.published = true;
    editBook(book._id, book);
    location.reload();
  };

  const removeBook = async (bookId) => {
    const res = await deleteBooks(bookId);
  };

  const deleteBookLibrary = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: user._id,
    };
    const res = await removeBookLibrary(objectsId);
    location.reload();
  };

  return (
    <main className="text-indigo-100 w-screen my-20 flex flex-col gap-10 justify-center items-center">
      {user ? (
        <section className="relative flex  flex-col gap-5  justify-center  items-center">
          <h2 className="text-5xl flex gap-2">
            <span className="font-bold">{user.userName}</span>
            {user.lastName}
          </h2>
          <div className="relative flex  gap-72 justify-center items-center  text-white z-10">
            <button
              className="btn text-2xl"
              onClick={() => navigate("/createBook")}
            >
              <h3>
                <span>C</span>rea una nueva historia
              </h3>
            </button>
          </div>
        </section>
      ) : null}
      {user && user.books ? (
        <section className="w-full p-5 text-3xl flex flex-col gap-5">
          <h2>
            <span className="font-bold">Mis</span> Historias
          </h2>
          <div className="flex flex-wrap gap-5">
            {user
              ? user.books.map((book, i) => {
                  return (
                    <div key={i} className="flex flex-col h-72">
                      <h2 className="text-xl  py-3 font-semibold">
                        <span>{book.title[0]}</span>
                        {book.title.slice(1)}
                      </h2>
                      <div className="flex">
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="w-32 h-52 rounded-lg object-cover"
                        />
                        <p className="absolute w-10 h-10 flex justify-center items-center m-2  text-xl text-orange-300 z-[100] border-[3px] border-indigo-600 rounded-full bg-black/70">
                          {book.rating}
                        </p>
                        <div className="text-xl flex flex-col gap-2  rounded-l-none rounded-b-xl  p-5">
                          <button
                            className="p-1 bg-indigo-950 rounded-lg btn flex   justify-start"
                            onClick={() => {
                              localStorage.setItem("bookId", book._id),
                                navigate("/editBook");
                            }}
                          >
                            <span>E</span>ditar
                          </button>
                          <button
                            className="btn w-12 flex justify-start"
                            onClick={() => {
                              localStorage.setItem("bookId", book._id),
                                navigate("/readBook");
                            }}
                          >
                            <span>L</span>eer
                          </button>
                          <button
                            className="btn  w-10 flex justify-start"
                            onClick={() => {
                              localStorage.setItem("bookId", book._id);
                              navigate("/PageBook");
                            }}
                          >
                            <span>I</span>nfo
                          </button>

                          {book.published !== true ? (
                            <button
                              className="btn  w-10 flex justify-start"
                              onClick={() => handlePublish(book)}
                            >
                              <span>P</span>ublicar
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => {
                              setHandeDelete(true), setNumDeleteBook(i);
                            }}
                          >
                            <button>
                              <span>E</span>liminar libro
                            </button>
                          </button>
                          {handleDelete && numDeleteBook === i ? (
                            <div className="relative flex flex-col items-center text-sm  bg-indigo-400 rounded-md">
                              <h3>Confirmar</h3>
                              <div className="w-full flex justify-around">
                                <button
                                  className="text-xl text-green-700 cursor-pointer font-black"
                                  onClick={() => {
                                    //Elimina la imagen de Cloudinary
                                    removeImg(book.imageUrl);
                                    removeBook(book._id);
                                  }}
                                >
                                  V
                                </button>
                                <p
                                  onClick={() => setHandeDelete(false)}
                                  className="text-xl text-red-600 cursor-pointer font-black"
                                >
                                  X
                                </p>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </section>
      ) : null}
      {user ? (
         <section className="w-full p-5 text-3xl flex flex-col gap-5">
          <h2 className="text-3xl  text-white">
            <span>Mi</span> Biblioteca
          </h2>
          <div className="flex gap-5  flex-wrap ">
            {user && user.booksLibrary.length > 0
              ? user.booksLibrary.map((book, i) => {
                  console.log(book);
                  return (
                    <div key={i}>
                      {console.log(i)}

                      <div className="w-full relative">
                        <h2 className="text-xl  py-3 font-semibold">
                          <span>{book.title[0]}</span>
                          {book.title.slice(1)}
                        </h2>
                        <div className="flex">
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-32 h-52 object-cover"
                          />
                          <p className="absolute w-10 h-10 flex justify-center items-center m-2  text-xl text-orange-300 z-[100] border-[3px] border-indigo-600 rounded-full bg-black/70">
                            {book.rating}
                          </p>
                          <div className="text-xl flex flex-col gap-2  rounded-l-none rounded-b-xl  p-5">
                            <button
                              className="btn w-12 flex justify-start"
                              onClick={() => {
                                localStorage.setItem("bookId", book._id),
                                  navigate("/readBook");
                              }}
                            >
                              <span>L</span>eer
                            </button>
                            <button
                              className="btn  w-10 flex justify-start"
                              onClick={() => {
                                localStorage.setItem("bookId", book._id);
                                navigate("/PageBook");
                              }}
                            >
                              <span>I</span>nfo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteBookLibrary(book._id);
                              }}
                              className="btn  flex justify-start"
                            >
                              <span>-&nbsp;</span>bliblioteca
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
