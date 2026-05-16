import React, { useEffect, useState } from "react";
import { getBook, editBook, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ReadComments() {
  window.scrollTo(0, 0);
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
    <main className="page-shell flex">
      <section className="page-container flex flex-col flex-wrap items-center text-white">
        {book && (
          <h2 className="page-title mb-4">
            <span>{book.title[0]}</span>
            {book.title.slice(1)}
          </h2>
        )}
        <h3 className="mb-8 text-3xl font-bold">
          <span>C</span>omentarios
        </h3>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {book &&
            book.comments.map((comment, index) => (
              <div
                key={index}
                className="glass-card flex flex-col gap-5 p-5"
              >
                <h3 className="text-2xl font-semibold text-indigo-100">{comment.user}</h3>
                <p className="max-h-60 overflow-auto rounded-2xl bg-slate-950/50 p-5 text-[18px] leading-7 text-slate-200">
                  {comment.text}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <p>{comment.update.day}</p>
                  <p>/</p>
                  <p>{comment.update.month}</p>
                  <p>/</p>
                  <p>{comment.update.year}</p>
                  {user && book.idUserComments[index] === user._id && (
                    <div className="flex">
                      <button
                        onClick={() => setActiveEdit(index)}
                        className="btn-secondary ml-0 sm:ml-3"
                      >
                        Editar
                      </button>
                      {activeEdit === index && (
                        <div className="fixed left-1/2 top-1/2 z-[120] flex w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-3xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
                          <textarea
                            placeholder="Escribe aquí tu comentario."
                            className="h-40"
                            type="text"
                            value={editText}
                            onChange={handleChange}
                          />
                          <div className="flex w-full flex-wrap justify-center gap-4">
                            <div
                              className="btn-danger cursor-pointer"
                              onClick={() => setActiveEdit(null)}
                            >
                              Cancelar
                            </div>
                            {activeButton && (
                              <div
                                className="btn-primary cursor-pointer"
                                onClick={() => handleSubmit(index)}
                              >
                                Guardar
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
