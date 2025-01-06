import React, { useEffect, useState } from "react";
import { getBook, editBook, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function EditBook() {
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [verifyDelete, setVerifyDelete] = useState({ verify: false, num: 0 });
  const [activeDescription, setActiveDescription] = useState(false);
  const [state, setState] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/allBooks");
        return;
      }

      const userRes = await profile();
      if (userRes.data.message === "No autorizado") {
        navigate("/");
        return;
      }

      setUser(userRes.data.userFound);
      setBook(await getBook(localStorage.getItem("bookId")));
    };

    fetchData();
  }, [state, navigate]);

  const handleAddChapter = (e) => {
    localStorage.setItem("numChapter", e);
    navigate("/writingPage");
  };

  const handleDelete = async (index) => {
    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    const updatedBook = { ...book, chapters: updatedChapters };
    await editBook(book._id, updatedBook);
    setState(!state);
  };

  const handleDescription = async (e) => {
    e.preventDefault();
    const newDescription = e.target[0].value;
    const updatedBook = { ...book, description: newDescription };
    await editBook(book._id, updatedBook);
    setActiveDescription(false);
  };

  if (!book) return null; // Render nothing if book is not yet fetched.

  return (
    <main className="absolute overflow-x-hidden w-[98.5vw] h-screen">
      <section className="relative w-full h-full px-20 mt-20">
        <div className="fixed w-[300px] h-[300px] ml-[500px] rounded-full bg-blue-600/5 mt-[70px] blur-xl"></div>
        <div className="fixed w-[300px] h-[300px] mt-20 ml-60 rounded-full bg-red-600/10 blur-xl"></div>
        <div className="fixed w-[350px] h-[450px] mt-20 -ml-20 bg-gradient-to-b from-green-600/15 blur-xl"></div>

        {book.title && <h2 className="relative h-16 text-white text-5xl mb-10">{book.title}</h2>}

        {book.chapters?.length > 0 && (
          <div className="relative w-[850px] h-14 flex justify-between items-center text-white bg-gradient-to-r p-5 rounded-3xl from-orange-600/[0.5]">
            <h3 className="w-20 border-r border-orange-500">Capítulo</h3>
            <h3 className="w-96 border-r border-orange-500">Descripción</h3>
            <h3 className="w-40">Última actualización</h3>
          </div>
        )}

        {book.chapters?.map((e, i) => (
          <section key={i}>
            <div className="relative w-[80vw] h-14 flex justify-between items-center text-white bg-gradient-to-r px-5 my-5 rounded-3xl from-slate-600/[0.5]">
              <h3 className="w-20 border-r border-orange-500">#{i + 1}</h3>
              <h3 className="w-96 flex justify-start items-start text-center border-r border-orange-500">{e.title}</h3>
              <h3 className="w-52 border-r border-orange-600">{new Date(book.updatedAt).toLocaleDateString()}</h3>
              <button onClick={() => handleAddChapter(i + 1)} className="btn">Editar</button>
              <button onClick={() => setVerifyDelete({ verify: true, num: i })} className="btn w-20">Eliminar</button>
              {verifyDelete.verify && verifyDelete.num === i && (
                <div className="absolute w-96 text-red-400 font-bold flex text-center gap-5 ml-[900px] z-[100] bg-slate-700 p-2 rounded-full">
                  <h3>Confirma que deseas eliminar el capítulo</h3>
                  <p onClick={() => handleDelete(i)} className="text-green-400 cursor-pointer font-bold">V</p>
                  <p onClick={() => setVerifyDelete({ verify: false })} className="text-red-400 cursor-pointer font-bold">X</p>
                </div>
              )}
            </div>
          </section>
        ))}

        <div className="relative flex items-center gap-10 h-20">
          <button onClick={() => handleAddChapter(book.chapters.length + 1)} className="btn">Añadir Capitulo</button>
          <button onClick={() => navigate("/pageBook")} className="btn">Ver libro</button>
          <button onClick={() => navigate("/readBook")} className="btn">Leer libro</button>
          <button onClick={() => setActiveDescription(true)} className="btn">Editar descripción</button>
        </div>

        {activeDescription && (
          <form onSubmit={handleDescription} className="mt-52 w-96 h-60 text-white">
            <textarea className="w-full rounded-md bg-slate-800" placeholder="Nueva descripción" />
            <div className="w-full justify-center gap-5 flex">
              <button type="button" className="text-red-600 text-2xl font-bold" onClick={() => setActiveDescription(false)}>X</button>
              <button type="submit" className="text-green-600 text-2xl font-bold">V</button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
