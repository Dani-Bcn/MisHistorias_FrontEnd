import React, { useEffect, useState } from "react";
import { getBook, editBook, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ReadComments() {
  const [book, setBook] = useState();
  const [user, setUser] = useState();
  const [activeEdit, setActiveEdit] = useState(null); // Mantiene el índice del comentario en edición
  const [editText, setEditText] = useState(""); // El texto para editar
  const [activeButton, setActiveButton] = useState(false); // Botón habilitado solo si el texto tiene más de 5 caracteres
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const res = await profile();
      setUser(res.data.userFound);
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const searchBook = async () => {
    try {
      const res = await getBook(localStorage.getItem("bookId"));
      if (res) setBook(res.data);
    } catch (error) {
      console.error("Error fetching book", error);
    }
  };

  useEffect(() => {
    getUser();
    searchBook();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setEditText(value);
    setActiveButton(value.length > 5);
  };

  const handleSubmit = (index) => {
    if (!activeButton) return;

    const updatedComments = [...book.comments];
    updatedComments[index].text = editText;

    editBook(book._id, { ...book, comments: updatedComments }).then(() => {
      setBook((prev) => ({ ...prev, comments: updatedComments }));
      setActiveEdit(null); // Cerrar el modo de edición después de guardar
    }).catch((error) => {
      console.error("Error editing book", error);
    });
  };

  return (
    <main className="w-screen flex">
      <section className="w-full flex flex-col flex-wrap items-center mt-20 text-white text-4xl">
        {book && (
          <h2 className="text-6xl mb-10">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        )}
        <h3>
          <span>C</span>omentarios
        </h3>
        <div className="w-full flex flex-wrap p-20 gap-20">
          {book &&
            book.comments.map((comment, index) => (
              <div
                key={index}
                className="w-96 p-5 flex flex-col gap-5 flex-wrap bg-slate-800/50 rounded-xl"
              >
                <h3 className="text-2xl">{comment.user}</h3>
                <p className="w-80 leading-5 text-[18px] flex flex-wrap overflow-auto bg-slate-600/50 rounded-md p-5">
                  {comment.text}
                </p>
                <div className="flex text-xl gap-2">
                  <p>{comment.update.day}</p>
                  <p>/</p>
                  <p>{comment.update.month}</p>
                  <p>/</p>
                  <p>{comment.update.year}</p>
                  {user && book.idUserComments[index] === user._id && (
                    <div className="flex w-96">
                      <button
                        onClick={() => setActiveEdit(index)}
                        className="btn text-xl mx-20 bg-slate-600 rounded-md px-5"
                      >
                        <span>E</span>ditar
                      </button>
                      {activeEdit === index && (
                        <div className="absolute w-[450px] h-60 bg-slate-800 mx-20 rounded-md -mt-44 flex flex-col items-center gap-5">
                          <textarea
                            placeholder="Escribe aquí tu comentario."
                            className="rounded-md h-40 w-[95%] mt-5"
                            type="text"
                            value={editText}
                            onChange={handleChange}
                          />
                          <div className="flex w-[80%] justify-center gap-10">
                            <div
                              className="text-3xl font-black hover:text-red-600 transition-all cursor-pointer"
                              onClick={() => setActiveEdit(null)}
                            >
                              X
                            </div>
                            {activeButton && (
                              <div
                                className="text-3xl font-black hover:text-green-600 transition-all cursor-pointer"
                                onClick={() => handleSubmit(index)}
                              >
                                V
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
