import React, { useEffect, useRef, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { addBook } from "../api/auth";
import { arrayGenres } from "../components/Images_Genres";
import Cookies from "js-cookie";
import gsap from "gsap";

export default function AllBooks() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [activeDescription, setActiveDescription] = useState(true);
  const [acces, setAcces] = useState(false);

  const searchBooks = async () => {
    const res = await getAllBooks();
    if (acces) {
      const resUser = await profile();
      setUserId(resUser.data.userFound._id);
      setUser(resUser.data.userFound);
    }
    setBooks(res.data.booksFound);
  };

  useEffect(() => {
    searchBooks();
    setAcces(Cookies.get("token"));
  }, [acces]);

  const getBook = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: userId,
    };
    const res = await addBook(objectsId);
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

  user?console.log(books,user):null

  return (
    <main className="w-screen flex  justify-center text-white">
      <section className="w-full my-32 mx-10 flex flex-wrap justify-between">
        {books
          ? books.map((e, i) => {
              if (e.published === true) {
                return (
                  <div
                    key={i}
                    className="relative w-[425px] p-5  text-xl flex justify-between"
                  >
                    <div
                      id={`card${i}`}
                      className="absolute blur-xl w-20 h-20 mt-40 ml-80  bg-green-400/[0.2] z-0 rounded-full rotate-[35deg] shadow-[0px_0px_10px] shadow-black "
                    ></div>
                    <div
                      id={`card2${i}`}
                      className="absolute blur-xl w-20 h-20 mt-40 ml-40  bg-blue-600/[0.2] z-0 rounded-full rotate-[35deg] shadow-[0px_0px_10px] shadow-black"
                    ></div>
                    <div
                      id={`card3${i}`}
                      className="absolute blur-xl w-20 h-20 ml-10 mt-40  bg-orange-600/[0.2] z-0 rounded-full rotate-[35deg] shadow-[0px_0px_10px] shadow-black"
                    ></div>
                    <div>
                      <div className="absolute w-[500px]">
                        <span>
                          <h3 className="absolute text-3xl font-bold z-10">
                            {e.title[0].toUpperCase()}
                          </h3>
                        </span>
                        <h3 className="absolute text-3xl font-bold mx-4 z-10">
                          {e.title.slice(1)}
                        </h3>
                      </div>
                      <img
                        src={e.imageUrl}
                        alt="imageUrl"
                        className=" w-40 h-72 object-cover mt-10 rounded-br-[15px] rounded-tr-[15px]  shadow-[0px_0px_10px] shadow-black border border-blue-400 z-10"
                      />
                      <p className="absolute w-16 h-16 flex justify-center items-center -mt-12  -ml-5 text-4xl text-orange-400 z-[1] border-[3px] border-blue-600 rounded-full bg-black">
                        {e.rating}
                      </p>
                    </div>
                    <div
                      key={i}
                      className="w-52 mt-10 items-start gap-2 flex flex-col  z-1"
                    >
                      <div className="flex gap-2 text-3xl">
                        <span>
                          <p className="font-bold">{e.dataUser.userName}</p>
                        </span>
                        <p>{e.dataUser.lastName}</p>
                      </div>
                      <h3 className="text-2xl">
                        <span>{e.genre[0]}</span>
                        {e.genre.slice(1)}
                      </h3>
                      <button
                        className="btn flex justify-start"
                        onClick={() => {
                          handleDescription(e.title);
                        }}
                      >
                        <span>D</span>escripción
                      </button>
                      <div
                        id={e.title.replaceAll(" ", "")}
                        onClick={() => quitDescription(e.title)}
                        className="absolute invisible opacity-0	z-[50]  -mt-10 -ml-40  cursor-pointer  w-96 bg-slate-700 p-5 rounded-xl text-[14px]"
                      >
                        {e.description}
                      </div>
                      <button
                        className="btn relative flex justify-start z-[1]"
                        onClick={() => {
                          localStorage.setItem("bookId", e._id);
                          navigate("/PageBook");
                        }}
                      >
                        <span>I</span>nfo
                      </button>
                      <button
                        className="btn relative flex justify-start"
                        onClick={() => {
                          localStorage.setItem("bookId", e._id),
                            navigate("/readBook");
                        }}
                      >
                        <span>L</span>eer
                      </button>
                      {user ? (
                        <div className="flex flex-col items-start gap-2">
                          <button
                            className="btn flex justify-start"
                            onClick={() => getBook(e._id)}
                          >
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

                      {e.numVotes.length > 0 ? (
                        <h3 className="text-[18px]">
                          <span>V</span>aloraciones {e.numVotes}
                        </h3>
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
