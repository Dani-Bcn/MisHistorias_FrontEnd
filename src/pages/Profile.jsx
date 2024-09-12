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
  const [state, setState] = useState(false);

  const getUser = async () => {
    const res = await profile();
   setUser(res.data.userFound) 
  };

  const removeImg = async (values) => {
    await deleteImg({ coco: values });
  };

  const handlePublish = (book) => {
    book.published = true;
    editBook(book._id, book);
  };

  const removeBook = (book) => {
    user.books.map((books, i) => {
      if (books._id === books) {
        user.books.splice(i, 1);
        setState(!state);
      }
    });
    deleteBooks(book);
  };

  const deleteBookLibrary = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: user._id,
    };
    const res = await removeBookLibrary(objectsId);
    setState(!state);
  };
  useEffect(() => {
    getUser();
  }, []);
 

  return (
    <main className="w-screen flex flex-col gap-10 justify-center items-center">
      {user ? (
        <section className="relative flex  flex-col  justify-center  items-center mt-48">
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
              className="btn text-3xl"
              onClick={() => navigate("/createBook")}
            >
              <h3 className="mt-5">
                <span>C</span>rear una nueva historia
              </h3>
            </button>
          </div>
        </section>
      ) : null}
      {user && user.books.length > 0 ? (
        <section className="w-full pr-40 pl-20 mb-32 mt-20 items-center">
          <h2 className="text-3xl font-bold text-white my-5">
            <span>Mis</span> Historias
          </h2>
          <div className="flex gap-64 flex-wrap py-10">
            {user
              ? user.books.map((book, i) => {
                  return (
                    <div
                      key={i}
                      className="w-60 h-40 flex flex-col text-white border-l border-t border-orange-600 rounded-l-xl rounded-bl-none  px-5 "
                    >
                      <div className="w-full relative">
                        <h2 className="text-2xl w-96 py-3 font-semibold">
                          <span>{book.title[0]}</span>
                          {book.title.slice(1)}
                        </h2>
                        <div className="flex">
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-32 h-52 object-cover"
                          />
                          <p className="absolute w-16 h-16 flex justify-center items-center mt-36 -ml-5 text-4xl text-orange-400 z-[100] border-[3px] border-blue-600 rounded-full bg-black">
                            {book.rating}
                          </p>
                          <div className=" flex flex-col gap-2 border-b border-r rounded-l-none rounded-b-xl border-orange-600 p-5">
                            <button
                              className="w-16 btn flex justify-start"
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
                                onClick={() => {
                                  handlePublish(book), setState(!state);
                                }}
                              >
                                <span>P</span>ublicar
                              </button>
                            ) : (
                              <h3 className="font-semibold text-[18px]">
                                <span>P</span>ublicado
                              </h3>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setHandeDelete(true), setNumDeleteBook(i);
                              }}
                              className="btn w-28 flex justify-start"
                            >
                              <span>E</span>liminar libro
                            </button>
                            {handleDelete && numDeleteBook === i ? (
                              <div className="text-red-600">
                                <h3>Confirma que quieres eliminar el libro</h3>
                                <div className="w-full flex gap-10">
                                  <p
                                    className="text-xl text-green-600 cursor-pointer font-black"
                                    onClick={() => {
                                      //Elimina la imagen de Cloudinary
                                      removeBook(book._id),
                                        removeImg(book.imageUrl),
                                        setState(!state);
                                    }}
                                  >
                                    V
                                  </p>
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
                    </div>
                  );
                })
              : null}
          </div>
        </section>
      ) : null}
      {user && user.booksLibrary.length > 0 ? (
        <section className="w-full pr-32 pl-20 mb-32 items-center">
          <h2 className="text-3xl font-bold text-white my-5">
            <span>Mi</span> Biblioteca
          </h2>
          <div className="flex gap-64 py-10 flex-wrap ">
            {user
              ? user.booksLibrary.map((book, i) => {
                  return (
                    <div
                      key={i}
                      className="w-60 h-40 flex flex-col text-white border-l border-t border-orange-600 rounded-l-xl rounded-bl-none px-5 "
                    >
                      <div className="w-full relative">
                        <h2 className="text-2xl w-96 py-3 font-semibold">
                          <span>{book.title[0]}</span>
                          {book.title.slice(1)}
                        </h2>
                        <div className="flex">
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-32 h-52 object-cover"
                          />
                          <p className="absolute w-16 h-16 flex justify-center items-center mt-36  -ml-5 text-4xl text-orange-400 z-[100] border-[3px] border-blue-600 rounded-full bg-black">
                            {book.rating}
                          </p>
                          <div className="m-5 h-48 flex flex-col gap-2 border-b border-r rounded-l-none rounded-b-xl border-orange-600 px-5 ">
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
                                deleteBookLibrary(book._id)
                              }}
                              className="btn w-28 flex justify-start"
                            >
                              <span> - &nbsp;</span>bliblioteca
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
