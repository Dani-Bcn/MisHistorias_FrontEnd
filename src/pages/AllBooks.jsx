import React, { useEffect, useRef, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { addBook } from "../api/auth";
import gsap from "gsap";

export default function AllBooks() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [acces, setAcces] = useState(false);

  const searchBooks = async () => {
    const res = await getAllBooks();
    if (acces) {
      const resUser = await profile();
      !resUser.data.message ? setUserId(resUser.data.userFound._id) : null;
      setUser(resUser.data.userFound);
    }
    setBooks(res.data.booksFound);
  };

  useEffect(() => {
    searchBooks();
    setAcces(localStorage.getItem("token"));
  }, [acces]);
  const getBook = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: userId,
    };
    await addBook(objectsId);
  };

  const handleDescription = (e, i) => {
    gsap.to(`#${e.replaceAll(" ", "")}`, {
      visibility: "visible",
      opacity: 1,
      marginTop: 40,
    });
  };

  const quitDescription = (e, i) => {
    gsap.to(`#${e.replaceAll(" ", "")}`, {
      visibility: "hidden",
      opacity: 0,
      marginTop: 0,
    });
  };

  return (
    <main>
      <section className=" w-secreen bg-slate-800 text-2xl  p-5 text-white">
        {books
          ? books.map((e, i) => {
              if (e.published === true) {
                return (
                  <div key={i} className="mt-20">
                    <div id={`card${i}`}></div>
                    <div id={`card2${i}`}></div>
                    <div id={`card3${i}`}></div>
                    <div>
                      <div className="flex text-2xl">
                        <span>
                          <h3>{e.title[0].toUpperCase()}</h3>
                        </span>
                        <h3>{e.title.slice(1)}</h3>
                      </div>
                      <p className="absolute w-20 h-20 m-2 flex justify-center items-center text-5xl boder-red-200 border-4 bg-slate-950/[0.6] border-orange-600 rounded-full  z-[10]">{e.rating}</p>
                      <img
                        src={e.imageUrl}
                        alt="imageUrl"
                        className="w-full opacity-70 relalative "
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleDescription(e.title);
                      }}
                    >
                      <span>D</span>escripción
                    </button>
                    <div
                      id={e.title.replaceAll(" ", "")}
                      onClick={() => quitDescription(e.title)}
                    >
                      {e.description}
                    </div>
                    <div key={i}>
                      <div>
                        <span>
                          <p>{e.dataUser.userName}</p>
                        </span>
                        <p>{e.dataUser.lastName}</p>
                      </div>
                      <h3>
                        <span>{e.genre[0]}</span>
                        {e.genre.slice(1)}
                      </h3>

                      <button
                        onClick={() => {
                          localStorage.setItem("bookId", e._id);
                          navigate("/PageBook");
                        }}
                      >
                        <span>I</span>nfo
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("bookId", e._id),
                            navigate("/readBook");
                        }}
                      >
                        <span>L</span>eer
                      </button>
                      {user ? (
                        <div>
                          <button onClick={() => getBook(e._id)}>
                            <span>A</span>ñadir Biblioteca
                          </button>
                        </div>
                      ) : null}
                      {e.comments.length > 0 ? (
                        <button
                          onClick={() => {
                            localStorage.setItem("bookId", e._id),
                              navigate("/readComments");
                          }}
                        >
                          <span>C</span>omentarios {e.comments.length}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              }
            })
          : null}
      </section>
    </main>
  );
}
