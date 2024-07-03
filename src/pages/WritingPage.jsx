import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function WritingPage() {


  const navigate = useNavigate()
  const [verifyField, setVerifyField] = useState(true);
  const [getBookLocal, setgetBookLocal] = useState(
    localStorage.getItem("bookId")
  );
  const [numberChapter, setNumberChapter] = useState(
    localStorage.getItem("numChapter")
  );
  const [book, setBook] = useState();
  const [title, setTitle] = useState();
  const [text, setText] = useState();
  const [stateEdit, setStateEdit] = useState(false);

  const handleBook = async () => {
    console.log(numberChapter);
    const res = await getBook(getBookLocal);
    setBook(res.data);
    if (book) {
      setTitle(book.chapters[numberChapter - 1].title);
      setText(book.chapters[numberChapter - 1].text);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target[0].value === "") {
      setVerifyField(true);
    }

    console.log(title)
    book.chapters[numberChapter - 1] = {
      
      title: title,
      text: text,
    };
    book ? editBook(book._id, book) : null;
    navigate("/editBook")
  };

  setTimeout(() => {
    setStateEdit(true);
  }, 100);

  useEffect(() => {
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

  return (
    <main>
      <section className="w-[90vw] h-[40vh] m-20 mt-20">
        <form
          className="w-full h-[40vh] text-xl text-slate-300"
          onSubmit={handleSubmit}
        >
          <input
            placeholder="Título del capítuilo"
            className=" w-96 my-10 h-10 bg-slate-800"
            name="title"
            id="title"
            type="text"
            onChange={(e) => handleChangeTitle(e)}
            value={title}
          />
          <textarea
            className="w-full h-[600px] bg-slate-800"
            id="text"
            name="text"
            value={text}
            onChange={(e) => handleChangeText(e)}
          />
          <button
        
            type="submit"
            className="px-5 py-3 my-5 bg-orange-400 hover:bg-slate-900 text-slate-900 hover:text-orange-400 rounded-md transition-all"
          
          >
            Guardar
          </button>
        </form>
      </section>
    </main>
  );
}
