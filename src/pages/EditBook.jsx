import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { profile } from "../api/auth";

export default function EditBook() {
  const [booksUser, setBooksUser] = useState();
  const [verifyDelete, setVerifyDelete] = useState({ verify: false, num: 0 });
  const [activeDescription, setActiveDescription] = useState(false);

  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [book, setBook] = useState();
  const [user, setUser] = useState();
  const [chapters, setChapters] = useState();
  const [state, setState] = useState(false);
  
  const coco = async () => {
    if (!localStorage.getItem("token")) navigate("/allBooks");
    const res = await profile();
    res.data.message === "No autorizado" ? navigate("/") : null;
    setBooksUser(res.data.userFound.books);
  };

  const handleBooks = async () => {
    const res = await getBook(localStorage.getItem("bookId"));
    res ? setBook(res.data) : null;
    book ? setChapters(book.chapters) : null;
  };

  useEffect(() => {
    handleBooks();
    coco();
  }, [state]);

  const handleAddChapter = (e) => {  
    localStorage.setItem("numChapter", e);
    navigate("/writingPage");
  };

  const handleDelete = async (e) => {
    book.chapters.splice(e, 1);
    await editBook(book._id, book);
    setState(!state);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    book.description = e.target[0].value;
    editBook(book._id, book);
    setActiveDescription(false);
  };

  return (
    <main className="absolute overflow-x-hidden w-[98.5vw] h-screen ">
      <section className="relative w-full h-fulll px-20 mt-20">
        <div className="fixed w-[300px] h-[300px] ml-[500px] rounded-full  bg-blue-600/5 mt-[70px] blur-xl"></div>
        <div className="fixed w-[300px] h-[300px] mt-20 ml-60 rounded-full  bg-red-600/10 ]  blur-xl"></div>
        <div className="fixed w-[350px] h-[450px] mt-20 -ml-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>
        {book && book.title ? (
          <h2 className="relative h-16 text-white text-5xl mb-10">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        ) : null}

        {book && book.chapters && book.chapters.length !== 0 ? (
          <div className=" relative w-[850px] h-14 flex justify-between items-center text-white bg-gradient-to-r p-5 rounded-3xl from-orange-600/[0.5]">
            <h3 className="w-20 border-r border-orange-500">Nº</h3>
            <h3 className="w-96 border-r border-orange-500 ">Capítulo</h3>
            <h3 className="w-40">Última actulización </h3>
          </div>
        ) : null}
        {book
          ? book.chapters.map((e, i) => {
              return (
                <section key={i}>
                  <div
                    key={i}
                    className="relative w-[80vw] h-14 flex  justify-between items-center text-white bg-gradient-to-r px-5 my-5 rounded-3xl from-slate-600/[0.5]"
                  >
                    <h3 className="w-20  border-r border-orange-500">{`#${
                      i + 1
                    }`}</h3>
                    <h3 className="w-96 flex   justify-start items-start text-center  border-r border-orange-500">
                      {e.title}
                    </h3>
                    <h3 className="w-52 border-r border-r-orange-600">
                      {book.updatedAt
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")}
                    </h3>
                    <button
                      onClick={() => {
                        localStorage.setItem("numChapter", i + 1);
                        navigate("/writingPage");
                      }}
                      className="btn"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setVerifyDelete({ verify: true, num: i });
                      }}
                      className="btn w-20"
                    >
                      Eliminar
                    </button>
                    {verifyDelete.verify && verifyDelete.num === i ? (
                      <div className="absolute w-96 text-red-400 font-bold flex text-center gap-5 ml-[900px] z-[100] bg-slate-700 p-2  rounded-full">
                        <h3 className="">
                          Confirma que deseas eliminar el capítulo
                        </h3>
                        <p
                          onClick={() => {
                            handleDelete(i);
                          }}
                          className="text-green-400 cursor-pointer font-bold"
                        >
                          V
                        </p>
                        <p
                          onClick={() => {
                            setVerifyDelete({ verify: false });
                          }}
                          className="text-red-400 cursor-pointer font-bold"
                        >
                          X
                        </p>
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            })
          : null}
        {book ? (
          <div className="relative flex items-center gap-10 h-20 ">
            <button
              onClick={() => handleAddChapter(book.chapters.length + 1)}
              className="btn"
            >
              <span>A</span>ñadir Capitulo
            </button>
            <button
              onClick={() => {
                navigate("/pageBook");
              }}
              className="btn"
            >
              <span>V</span>er libro
            </button>
            <button
              onClick={() => {
                navigate("/readBook");
              }}
              className="btn"
            >
              <span>L</span>eer libro
            </button>
            <button onClick={() => setActiveDescription(true)} className="btn">
              <span>E</span>ditar descripción
            </button>
            {activeDescription ? (
              <form
                type="submit"
                onSubmit={(e) => handleDescription(e)}
                className="mt-52 w-96 h-60 text-white"
              >
                <textarea
                  className="w-full rounded-md bg-slate-800"
                  type="text"
                  placeholder="Nueva descripción"
                />
                <div className=" w-full justify-center gap-5 flex">
                  <button
                    className="text-red-600 text-2xl font-bold"
                    onClick={() => setActiveDescription(false)}
                  >
                    X
                  </button>

                  <button
                    type="submit"
                    className="text-green-600 text-2xl font-bold"
                  >
                    V
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}
