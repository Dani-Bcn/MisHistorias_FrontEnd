import React, { useEffect, useState } from "react";
import { getBook, profile } from "../api/auth";
import { useNavigate } from "react-router-dom";


export default function ReadBook() {
  const navigate = useNavigate();
  const [bookId] = useState(localStorage.getItem("bookId"));
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndBook = async () => {
      try {
        const [userRes, bookRes] = await Promise.all([
          profile(),
          getBook(bookId),
        ]);
        if (userRes?.data?.userFound) {
          setUser(userRes.data.userFound);
        }
        if (bookRes?.data) {
          setBook(bookRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndBook();
    window.scrollTo(0, 0); // Scroll to top on page load
  }, [bookId]);

  if (!book) return null;
  console.log(book)

  return (
    <main className="w-screen  text-white p-5 flex flex-col  items-center justify-center gap-5 mt-10">
      <header className="w-screen flex flex-col items-center gap-2 p-5">
        <h2 className="text-2xl xl:text-5xl mb-5">
          <span>{book?.dataUser.userName} </span>
          {book?.dataUser.lastName}
        </h2>
        <img
          onClick={() => navigate("/profile")}
          src= {book?.dataUser.imageUserUrl}
          alt="User"
          className="w-14 h-14 xl:w-40 xl:h-40 object-cover rounded-[100%] border-2 border-orange-400 cursor-pointer"
        />
        <h3 className="text-4xl xl:text-7xl text-center  my-5">
          <span>{book.title[0]}</span>
          {book.title.slice(1)}
        </h3>
        <div className="w-[80%] h-[0.5px] bg-gradient-to-r from-indigo-500/0 via-purple-500 to-pink-500/0"></div>
        <div className="w-screen xl:w-1/2  p-5">
          <h3 >
            <span>Descripción :</span>
          </h3>
          <p>{book.description}</p>
          
        </div>
     
      </header>
      <div className="w-[80%] h-[0.5px] bg-gradient-to-r from-indigo-500/0 via-purple-500 to-pink-500/0"></div>
      {/*   {book.chapters?.length > 0 && (
        <aside className="text-red-50 lg:w-56 w-full bg-gray-800 bg-opacity-70 rounded-xl p-5 lg:fixed lg:top-20 mt-10">
          <h3 className="text-xl border-b border-gray-500 mb-3">
            <span>C</span>apítulos
          </h3>
          <ul className="flex flex-col gap-3">
            {book.chapters.map((chapter, i) => (
              <Link
                key={i}
                to={chapter.title}
                spy
                smooth
                offset={-150}
                duration={500}
                className="cursor-pointer text-start text-sm hover:text-gray-300"
              >
                {chapter.title}
              </Link>
            ))}
          </ul>
        </aside>
      )} */}

      <div className="lg:w-2/4 w-full mx-auto text-red-50">
        {book.chapters?.map((chapter, i) => (
          <article
            id={chapter.title}
            key={i}
            className="bg-gray-800 bg-opacity-70 rounded-xl p-5 mb-10"
          >
            <h4 className="text-2xl mb-5">
              <span>{chapter.title[0]}</span>
              {chapter.title.slice(1)}
            </h4>
            <p className="text-lg leading-relaxed">
              <span className="text-2xl font-bold">{chapter.text[0]}</span>
              {chapter.text.slice(1)}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
