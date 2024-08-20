import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function WritingPage() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();

  const [getBookLocal, setgetBookLocal] = useState(
    localStorage.getItem("bookId")
  );
  const [numberChapter, setNumberChapter] = useState(
    localStorage.getItem("numChapter")
  );
  const [book, setBook] = useState(getBookLocal);
  const [title, setTitle] = useState();
  const [text, setText] = useState();
  const [stateEdit, setStateEdit] = useState(false);
  const [verifyTitle, setVerifyTitle] = useState(false);

  const handleBook = async () => {
    window.scrollTo(0, 0);
    const res = await getBook(getBookLocal);

    setBook(res.data);
    if (book && book.chapters) {
      setTitle(book.chapters[numberChapter - 1].title);
      setText(book.chapters[numberChapter - 1].text);
    }
  };

  useEffect(() => {
    setStateEdit(true);
    handleBook();
  }, [stateEdit]);

  const handleChangeTitle = (e) => {
    setTitle((prev) => (prev = e.target.value));
    book.chapters.title = title;
  };

  const handleChangeText = (e) => {
    setText((prev) => (prev = e.target.value));
    book.chapters.text = text;
  };

  const handleSubmit = (e) => {
    saveChapter();
  };

  const saveChapter = () => {
    book.chapters[numberChapter - 1] = {
      title: title,
      text: text,
    };
    book ? editBook(book._id, book) : null;
    navigate("/editBook"),
      setTimeout(() => {
        location.reload();
      }, 250);
  };

  return (
    <main>
      <section className=" w-[80vw] h-[60vh] m-20 mt-20 ">
        <form
          className="w-full h-[40vh] text-xl text-slate-300"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Título del capítulo"
            className=" w-96 my-1 h-10 bg-slate-800"
            name="title"
            id="title"
            type="text"
            onChange={(e) => handleChangeTitle(e)}
            value={title}
          />

          <textarea
            className="w-full p-5 my-5 h-[300px] text-[15px] bg-slate-800"
            id="text"
            name="text"
            placeholder="Texto"
            value={text}
            onChange={(e) => handleChangeText(e)}
          />
          {title && title.length > 0 ? (
            <button type="submit" className="btn">
              Guardar cápitulo
            </button>
          ) : (
            <h3 className="text-red-600">Debe escribir un título</h3>
          )}
        </form>
      </section>
    </main>
  );
}
