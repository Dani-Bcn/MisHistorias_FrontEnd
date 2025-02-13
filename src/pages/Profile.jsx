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
  const [handleDelete, setHandleDelete] = useState(false);
  const [isLibrary, setIsLibrary] = useState(true);
  const [isPublicated, setIsPublicated] = useState(false);

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
    
  
  }, [isLibrary, handleDelete, isPublicated]);

  const removeImg = async (values) => {
    await deleteImg({ imgLibro: values });
  };

  const handlePublish = (book) => {
    book.published = true;
    editBook(book._id, book);
    setIsPublicated(!isPublicated);
  };
  
  const handleRemovePublish = (book) => {
    book.published = false;
    editBook(book._id, book);
    setIsPublicated(!isPublicated);
  };  

  const deleteBookLibrary = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: user._id,
    };
  
    const res = await removeBookLibrary(objectsId);
  
    if (res && res.status === 200) {
      // Actualizar el estado del usuario para reflejar el cambio
      const updatedUser = { ...user };
      updatedUser.booksLibrary = updatedUser.booksLibrary.filter(book => book._id !== bookId);
      setUser(updatedUser);
    }
  };

  console.log(user);
  return (
    <main className=" h-min-screen mt-32 mb-20 text-slate-200 flex flex-col items-center ">
      {user ? (
        <section className="relative flex  flex-col gap-5  justify-center  items-center">
          <h2 className="text-4xl xl:text-7xl flex gap-2">
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
        <section className="w-screen sm:mx-20 flex flex-col items-center sm:items-start  gap-10">
          <h2 className="mt-5 lg:mt-10 text-3xl lg:text-4xl ">
            <span>Mis</span> libros
          </h2>
          <div className="w-80 sm:w-[80%]  h-[1px] bg-gradient-to-r  from-orange-500/0 sm:from-orange-500  sm:via-orange-500/50 via-orange-500 to-orange-500/0"></div>
          <section className="w-[72%] lg:w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5   ">
            {user
              ? user.books.map((book, i) => {
                  return (
                    <div
                      key={i}
                      className="w-56 aspect-auto relative p-5 bg-black hover:shadow-none transition-all duration-500 shadow-black/50 rounded-lg shadow-lg flex flex-col items-around justify-between"
                    >
                      <img
                        src={book.imageUrl}
                        alt="Book Cover"
                        className="  opacity-50 -m-5 w-full h-full absolute z-0   mask object-cover rounded-lg"
                      />
                      <h3 className="  z-10 text-xl font-bold  text-center text-orange-300">
                        {book.title}
                      </h3>
                      <div className="flex justify-end text-xl flex-col items-center">
                        <div className="flex gap-2 items-center justify-center">
                          <span className="font-bold">
                            {book.dataUser.userName}
                          </span>
                          <p className=" text-center text-transform: capitalize">
                            {book.dataUser.lastName}
                          </p>
                        </div>
                        <img
                          src={book.dataUser.imageUserUrl}
                          alt={book.dataUser.userName}
                          className="w-14 h-14 rounded-full border-2  border-orange-400 mt-2 object-cover"
                        />
                      </div>
                      <div className="mt-4 text-sm text-white gap-1 flex flex-col rounded-xl ">
                        <p>
                          <span>Género :</span> {book.genre}
                        </p>
                        <p>
                          <span>Capítulos :</span> {book.chapters.length}
                        </p>
                      </div>
                      <div className="my-4 flex items-center justify-between">
                        <div className="flex  items-center gap-2">
                          <p className="w-10 h-10 flex  justify-center items-center rounded-full border border-orange-400">
                            {book.rating}
                          </p>
                          <div className="flex items-center justify-center mt-2 gap-2">
                            <img
                              src="https://res.cloudinary.com/nneodani/image/upload/v1737915966/a1bbhiqtuctaocvffdhg.png"
                              alt="Rating Icon"
                              className="w-4"
                            />
                            <p>{book.numVotes}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            localStorage.setItem("bookId", book._id);
                            navigate("/PageBook");
                          }}
                          className="w-14 text-white p-1 border  border-indigo-400 rounded-lg text-xs text-center"
                        >
                          Info
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem("bookId", book._id);
                            navigate("/ReadBook");
                          }}
                          className="w-14 text-white p-1 border  border-indigo-400 rounded-lg text-xs text-center"
                        >
                          Leer
                        </button>
                        <button
                          onClick={() => {
                            localStorage.setItem("bookId", book._id),
                              navigate("/editBook");
                          }}
                          className="w-14 text-white p-1 border  border-indigo-400 rounded-lg text-xs text-center"
                        >
                          Editar
                        </button>
                        {!book?.published ? (
                          <button
                            onClick={() => handlePublish(book)}
                            className="w-14 text-white p-1 border  border-indigo-400 rounded-lg text-xs text-center"
                          >
                            Publicar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemovePublish(book)}
                            className="w-16 text-white p-1 border  border-indigo-400 rounded-lg text-xs text-center"
                          >
                           - publicar
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setHandleDelete(true);
                          }}
                          className="w-14 text-white p-1  border  border-indigo-400 rounded-lg text-xs text-center"
                        >
                          Eliminar
                        </button>
                        {handleDelete ? (
                          <div className="absolute w-20 h-14 grid grid-cols-2 grid-rows-2 bg-indigo-400 justify-center items-center rounded-md">
                            <p className="grid col-span-2 items-center justify-center">
                              Confirmar
                            </p>
                            <button
                              onClick={() => {
                                setHandleDelete(false);
                              }}
                              className="text-red-600 grid row-span-2 col-start-1"
                            >
                              X
                            </button>
                            <button
                              onClick={() => {
                                deleteBooks(book._id), setHandleDelete(false);
                              }}
                              className=" text-green-900 grid col-start-2 "
                            >
                              V
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              : null}
          </section>
        </section>
      ) : null}
      {user && user.booksLibrary.length > 0 ? (
        <section className="w-full py-20 sm:p-20 px-10 text-3xl flex flex-col gap-5 items-start">
          <h2 className="text-3xl  text-white text-center sm:text-start">
            <span>Mi</span> Biblioteca
          </h2>
          <div className="w-80  sm:w-[80%] h-[1px] bg-gradient-to-r from-orange-500 via-orange-500 to-orange-500/0 "></div>
          <div className="flex gap-5   flex-wrap ">
            {user && user.booksLibrary 
              ? user.booksLibrary.map((book, i) => {
                  return (
                    <div key={i}>
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
                                deleteBookLibrary(book._id)
                               ;
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
