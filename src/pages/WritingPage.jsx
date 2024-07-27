import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function WritingPage() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
  const [verifyField, setVerifyField] = useState(false);
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

  const handleBook = async () => {
    window.scrollTo(0, 0);
    const res = await getBook(getBookLocal);
    setBook(res.data);
    if (book) {
      setTitle(book.chapters[numberChapter - 1].title);
      setText(book.chapters[numberChapter - 1].text);
    }
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
  const handleSubmit = (e) => { 

    if (title === "") {
      setVerifyField(true)
    } else if (title != "")  {
   
      console.log(title);
      book.chapters[numberChapter - 1] = {
        title: title,
        text: text,
      };
      book ? editBook(book._id, book) : null;
      navigate("/editBook");
      location.reload()
    }
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
            className=" w-96 my-5 h-10 bg-slate-800"
            name="title"
            id="title"
            type="text"
            onChange={(e) => handleChangeTitle(e)}
            value={title}
          />
          {
            verifyField?
            <h3 className="text-red-600">
              Debe escrbir un título
            </h3>            
            :null
          }
          <textarea
            className="w-full p-5 my-10 h-[300px] text-[15px] bg-slate-800"

            id="text"
            name="text"
            placeholder="Texto"
            value={text}
            onChange={(e) => handleChangeText(e)}
          />
          <button
            type="submit"
           className="btn"
          >
            Guardar cápitulo
          </button>         
        </form>
      </section>
    </main>
  );
}
