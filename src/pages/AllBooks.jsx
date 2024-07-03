import React, { useEffect, useState } from "react";
import { getAllBooks, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { addBook } from "../api/auth";
import { arrayGenres } from "../components/Images_Genres";

export default function AllBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState();
  const [userId, setUserId] = useState();

  const searchBooks = async () => {
    const res = await getAllBooks();
    const resUser = await profile();
    console.log(resUser.data);
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
    console.log(res);
  };
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <section className="w-[90vw] h-screen mt-32 border-red-100 border ">
        {books
          ? books.map((e, i) => {
              const imagesFound = arrayGenres.find(
                (element) => element.genre === e.genre
              );
              return (
                <div
                  key={i}
                  className="relative flex bg-red-400 w-96  z-[50] cursor-pointer"
                >
                  <div className="flex text-3xl flex-col  items-center h-[500px] p-5">
                    <h3 className="w-52 text-2xl h-32  ">
                      {e.title.toUpperCase()}
                    </h3>
                    <img
                      src={e.imageUrl}
                      alt="imageUrl"
                      className="z-[-1] w- pt-10"
                    />
                    <div className="flex gap-5">
                      <p className="<-[10]">{e.dataUser.userName}</p>
                      <p>{e.dataUser.lastName}</p>
                    </div>
                  </div>
                  <div
                    key={i}
                    className="w-[350px] mt-20 text-2xl h-full flex flex-col gap-2 justify-start items-start text-start p-5"
                  >
                    <h3> Género : {e.genre}</h3>
                    <button
                      onClick={() => {
                        localStorage.setItem("bookId", e._id);
                        navigate("/PageBook");
                      }}
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem("bookId", e._id),
                          navigate("/readBook");
                      }}
                    >
                      Leer
                    </button>
                    {userId ? (
                      <div className="flex  flex-col gap-2">
                        <button onClick={() => getBook(e._id)}>
                          Añadir Biblioteca
                        </button>
                        <button>Valorar</button>
                        <button>Comentario</button>
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
