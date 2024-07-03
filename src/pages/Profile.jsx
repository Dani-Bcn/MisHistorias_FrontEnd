import React, { useEffect, useState } from "react";
import { profile, deleteBooks, editUser, getIdUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { split } from "postcss/lib/list";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [getBook, setGetBook] = useState();
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
  console.log(book)
  user.books.map((books, i) => {
    if (books._id === books) {
      user.books.splice(i, 1);
      location.reload();
    }
  });
  deleteBooks(book)
  };
  user?
console.log(user.books):null
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
    <main>
      {user ? (
        <header className="w-screen h-[550px]  bg-indigo-800/[0.4] flex justify-start items-center px-40 gap-20 transition-all  ">
          <img
            src={user.imageUserUrl}
            alt={user.userName}
            className="w-60 h-60 rounded-full border-[10px] border-orange-500"
          />
          {console.log(user.imageUserUrl)}
          <div className=" text-orange-100 flex flex-col gap-3 text-6xl">
            <h2 className="font-light">{user.userName}</h2>
            <h2 className="font-black text-orange-400">{user.lastName}</h2>
            <button
              onClick={() => navigate("/editUser")}
              className="text-3xl w-96 bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-2 transition-all "
            >
              Editar perfil
            </button>
            <button
              onClick={() => navigate("/createBook")}
              className="text-3xl w-96 bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-2 transition-all "
            >
              Crear una historia
            </button>
          </div>
          <div className=" text-orange-100 flex flex-col text-3xl "></div>
        </header>
      ) : null}
      <section className=" w-screen   px-40 py-5 flex flex-col text-5xl">
        <h2 className=" text-orange-200 py-5">Mis Historias</h2>
        <div className="w-screen h-[600px] py-20 flex gap-40">
          {user
            ? user.books.map((book, i) => {
                return (
                  <div key={i} className="flex gap-5 text-3xl">
                    <div className="relative w-80 h-[450px]  text-[1em] text-orange-100  flex flex-col justify-around items-center ">
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className=" absolute w-full  z-[-1]  h-[500px] shadow-black shadow-2xl brightness-[0.4] rounded-2xl"
                      />
                      <h2 className="text-center">{book.title}</h2>
                    </div>
                    <div className="w-72 flex flex-col gap-10">
                      <h3
                        className="w-40 text-3xl text-center bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all  cursor-pointer"
                        onClick={() => {
                          localStorage.setItem("bookId", book._id),
                            navigate("/editBook");
                        }}
                      >
                        Editar
                      </h3>
                      <h3
                        className="w-40 text-3xl cursor-pointer text-center bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all "
                        onClick={() => {
                          localStorage.setItem("bookId", book._id),
                            navigate("/readBook");
                        }}
                      >
                        Leer
                      </h3>
                      <button
                        className="w-40 text-3xl cursor-pointer text-center bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all "
                        onClick={() => {
                          localStorage.setItem("bookId", book._id);
                          navigate("/PageBook");
                        }}
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => removeBook(book._id)}
                        className="w-52 text-3xl cursor-pointer text-center bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all "
                      >
                        Eliminar libro
                      </button>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </section>
      <section className=" w-screen  px-40 py-5 flex flex-col text-5xl">
        <h2 className=" text-orange-200 py-5">Mi biblioteca</h2>
        <div className="w-screen py-20  flex flex-wrap gap-40">
          {user
            ? user.booksLibrary.map((e, i) => {
                return (
                  <div key={i} className="flex gap-5 text-3xl">
                    <div className="relative w-80 h-[450px]  text-[1em] text-orange-100  flex flex-col justify-around items-center ">
                      <img
                        src={e.imageUrl}
                        alt={e.title}
                        className=" absolute w-full z-[-1]  h-[500px] shadow-black shadow-2xl brightness-[0.4] rounded-2xl"
                      />
                      <h2 className="text-center">{e.title}</h2>
                      <div className="flex gap-3">
                        <div className="flex gap-3">
                          <h3>{e.dataUser.userName}</h3>
                          <h3>{e.dataUser.lastName}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="w-72 flex flex-col gap-10">
                      <h3
                        className="w-40 text-3xl cursor-pointer text-center bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all "
                        onClick={() => {
                          localStorage.setItem("bookId", e._id),
                            navigate("/readBook");
                        }}
                      >
                        Leer
                      </h3>
                      <button
                        className="w-40 text-3xl cursor-pointer text-center bg-indigo-200 hover:bg-slate-800 text-slate-800 hover:text-orange-400 rounded-md p-1 transition-all "
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
