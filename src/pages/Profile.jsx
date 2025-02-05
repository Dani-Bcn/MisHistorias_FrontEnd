import React, { useEffect, useState } from "react";
import {
  profile,
  deleteBooks,
  deleteImg,
  removeBookLibrary,
  editBook,
} from "../api/auth";
import { useNavigate } from "react-router-dom";
import { use } from "react";

export default function Profile() {
  /*  window.scrollTo(0, 0) */

  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [handleDelete, setHandeDelete] = useState(false);
  const [numDeleteBook, setNumDeleteBook] = useState();

  const getUser = async () => {
    const res = await profile();

    if (res && res.data.userFound) {
      setUser(res.data.userFound);
    } else {
      navigate("/allBooks");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const removeImg = async (values) => {
    await deleteImg({ coco: values });
  };

  const handlePublish = (book) => {
    book.published = true;
    editBook(book._id, book);
    location.reload();
  };

  const removeBook = async (bookId) => {
    const res = await deleteBooks(bookId);
  };

  const deleteBookLibrary = async (bookId) => {
    const objectsId = {
      bookId: bookId,
      userId: user._id,
    };
    const res = await removeBookLibrary(objectsId);
    location.reload();
  }; 

  return (
    <main className="w-screen flex flex-col gap-10 justify-center items-center bg-black text-white">
  {user && (
    <section className="relative flex flex-col justify-center items-center mt-40">
      <div className="relative -mt-20 py-5 flex gap-2 text-5xl font-bold">
        <h2>{user.userName} {user.lastName}</h2>
      </div>
      <img
        src={user.imageUserUrl}
        alt={user.userName}
        className="w-40 h-40 border-4 border-red-600 object-cover rounded-full shadow-lg"
      />
      <button
        className="mt-5 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        onClick={() => navigate('/createBook')}
      >
        Crear una nueva historia
      </button>
    </section>
  )}

  {user?.books?.length > 0 && (
    <section className="w-full px-10 mt-10">
      <h2 className="text-3xl font-bold mb-5">Mis Historias</h2>
      <div className="flex flex-wrap gap-5 p-5">
        {user.books.map((book, i) => (
          <div
            key={i}
            className="relative min-w-[250px] h-[300px] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all bg-gray-800"
          >
            <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3">
              <h3 className="text-lg font-bold truncate">{book.title}</h3>
              <p className="text-yellow-400 font-semibold">⭐ {book.rating}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => navigate('/readBook')}
                >Leer</button>
                <button
                  className="text-sm bg-gray-600 px-2 py-1 rounded hover:bg-gray-700 transition"
                  onClick={() => navigate('/PageBook')}
                >Info</button>
                <button
                  className="text-sm bg-green-600 px-2 py-1 rounded hover:bg-green-700 transition"
                  onClick={() => navigate('/editBook')}
                >Editar</button>
                <button
                  className="text-sm bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => removeBook(book._id)}
                >Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )}

  {user?.booksLibrary?.length > 0 && (
    <section className="w-full px-10 mt-10">
      <h2 className="text-3xl font-bold mb-5">Mi Biblioteca</h2>
      <div className="flex flex-wrap gap-5 p-5">
        {user.booksLibrary.map((book, i) => (
          <div
            key={i}
            className="relative min-w-[200px] h-[300px] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all bg-gray-800"
          >
            <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3">
              <h3 className="text-lg font-bold truncate">{book.title}</h3>
              <p className="text-yellow-400 font-semibold">⭐ {book.rating}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition"
                  onClick={() => navigate('/readBook')}
                >Leer</button>
                <button
                  className="text-sm bg-gray-600 px-2 py-1 rounded hover:bg-gray-700 transition"
                  onClick={() => navigate('/PageBook')}
                >Info</button>
                <button
                  className="text-sm bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => deleteBookLibrary(book._id)}
                >Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )}
</main>

  );
}
