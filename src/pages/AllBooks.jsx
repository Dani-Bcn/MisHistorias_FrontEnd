import React, { useEffect, useRef, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { addBook } from "../api/auth";
import { arrayGenres } from "../components/Images_Genres";
import gsap from "gsap";

export default function AllBooks() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [userId, setUserId] = useState();

  const handleOver = (i) => {
    gsap.to(`#img${i}`, {
      scale: 1.05,
      marginLeft:5,
      ease: "back.out",
    });

    gsap.to(`#card${i}`, {
      scale: 3,
      ease: "back.out",
    });
    gsap.to(`#card2${i}`, {
      scale: 3,
      ease: "back.out",
    });
    gsap.to(`#card3${i}`, {
      scale: 7,
      ease: "back.out",
    });
  
  };
  const handleOut = (i) => {
    gsap.to(`#img${i}`, {
      scale: 1,
      ease: "back.out",
    });
    gsap.to(`#card${i}`, {
      ease: "back.out",
      scale: 1,
    });
    gsap.to(`#card2${i}`, {
      scale: 1,
      ease: "back.out",
    });
    gsap.to(`#card3${i}`, {
      scale: 1,
      ease: "back.out",
    });
  };

  const searchBooks = async () => {
    const res = await getAllBooks();
    const resUser = await profile();
    resUser.data.message !== "No autorizado"
      ? setUserId(resUser.data.userFound._id)
      : null;
    setBooks(res.data.booksFound);
  };

  useEffect(() => {
    searchBooks();
  }, []);

  const getBook = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: userId,
    };
    const res = await addBook(objectsId);
   
  };
  return (
    <main className="w-screen flex  justify-center text-white">
      <section className="w-full   my-32 mx-10 flex flex-wrap justify-between">
        {books
          ? books.map((e, i) => {
              const imagesFound = arrayGenres.find(
                (element) => element.genre === e.genre
              );
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
                    <span>
                      <h3 className="absolute text-3xl font-bold z-10">
                        {e.title[0].toUpperCase()}
                      </h3>
                    </span>
                    <h3 className="absolute text-3xl font-bold mx-4 z-10">
                      {e.title.slice(1)}
                    </h3>
                    <img
                      id={`img${i}`}
                      onPointerOver={() => {
                        handleOver(i);
                      }}
                      onPointerOut={() => {
                        handleOut(i);
                      }}
                      src={e.imageUrl}
                      alt="imageUrl"
                      className="relative w-40 h-72 object-cover mt-10 rounded-br-[15px] rounded-tr-[15px]  shadow-[0px_0px_10px] shadow-black border border-blue-400 z-10"
                    />
                  </div>
                  <div
                    key={i}
                    className="w-52 mt-5 items-start p-5 flex flex-col gap-2 z-10"
                  >
                    <div className="flex gap-2 text-3xl">
                      <span>
                        <p className="font-bold">{e.dataUser.userName}</p>
                      </span>
                      <p>{e.dataUser.lastName}</p>
                    </div>
                    <h3 className="text-2xl">{e.genre}</h3>
                    <button
                      className="btn   flex justify-start"
                      onClick={() => {
                        localStorage.setItem("bookId", e._id);
                        navigate("/PageBook");
                      }}
                    >
                      Ver
                    </button>
                    <button
                      className="btn flex justify-start"
                      onClick={() => {
                        localStorage.setItem("bookId", e._id),
                          navigate("/readBook");
                      }}
                    >
                      Leer
                    </button>
                    {userId ? (
                      <div className="flex flex-col items-start gap-2">
                        <button className="btn   flex justify-start" onClick={() => getBook(e._id)}>
                          Añadir Biblioteca
                        </button>
                        <button className="btn   flex justify-start">Valorar</button>
                        <button className="btn   flex justify-start">Comentario</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          : null}
      </section>
    </main>
  );
}
