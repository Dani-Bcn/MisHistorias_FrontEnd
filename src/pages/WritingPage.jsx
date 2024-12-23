import React, { useEffect, useState } from "react";
import { getBook, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function WritingPage() {
  window.scrollTo(0, 0);
  const navigate = useNavigate();
 
  const [numberChapter, setNumberChapter] = useState(
    localStorage.getItem("numChapter")
  );
  const [book, setBook] = useState(getBookLocal);
  const [numChapter, setNumChapter] = useState();
  const [title, setTitle] = useState();
  const [text, setText] = useState(); 
  const [stateEdit, setStateEdit] = useState(false);  

  async function getBookLocal() {
    const res = await getBook(localStorage.getItem("bookId"));
    setBook(res.data);
    return book;
  }
   
  const getNumberChapter=()=> {
    const res =  setNumChapter(localStorage.getItem("numChapter"));   
    if ( book.chapters && book.chapters.length > numberChapter - 1) {
      setTitle(book.chapters[numberChapter - 1].title);
      setText(book.chapters[numberChapter - 1].text);
    }else{
      setTitle("");
      setText("");
    }
   
    return numChapter;
  }

  console.log(book);
  console.log(numChapter);  

  useEffect(() => {
    getNumberChapter();
    setStateEdit(true);   
  }, [book, stateEdit]);

  const handleChangeTitle = (e) => {
    setTitle((prev) => (prev = e.target.value));
    book.chapters.title = title;
  };

  const handleChangeText = (e) => {
    setText((prev) => (prev = e.target.value));
    book.chapters.text = text;
  };

  const saveChapter = () => {
    book.chapters[numberChapter - 1] = { 
      title: title,
      text: text,
    };
    setStateEdit(!stateEdit)
    console.log(book.chapters); 
    editBook(book._id, book);
   
  };
  console.log(title)

  return (
    <main>
      <section className=" w-[80vw] h-[60vh] m-20 mt-20 ">
        {book.chapters ? (
          <form
            className="w-full h-[40vh] text-xl text-slate-300"
            onSubmit={saveChapter}
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
            {title .length && text.length > 0 ? (
              <button type="submit" className="btn">
                Guardar cápitulo
              </button>
            ) : (
              <h3 className="text-red-600">Debe escribir un título</h3>
            )}
          </form>
        ) : null}
      </section>
    </main>
  );
}
