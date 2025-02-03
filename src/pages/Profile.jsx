import React, { useEffect, useState } from "react";
import {
  profile,
  deleteBooks,
  deleteImg,
  removeBookLibrary,
  editBook,
} from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [handleDelete, setHandeDelete] = useState(false);
  const [numDeleteBook, setNumDeleteBook] = useState();

  useEffect(() => {
    const getUser = async () => {
      const res = await profile();
      if (res && res.data.userFound) {
        setUser(res.data.userFound);
      } else {
        navigate("/allBooks");
      }
    };
    getUser();
  }, [navigate]);

  const handlePublish = (book) => {
    book.published = true;
    editBook(book._id, book);
    location.reload();
  };

  return (
    <main className="my-20   px-6 text-white flex flex-col justify-center items-center w-screen gap-20">
      {user && (
        <section className="text-center">
          <h2 className="text-5xl font-bold">{user.userName} {user.lastName}</h2>
          <img className="w-32 h-32 object-cover  rounded-full mt-4 shadow-lg border-4 border-gray-800" src={user.imageUserUrl} alt={user.userName} />
          <button className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 transition rounded shadow-md" onClick={() => navigate("/createBook")}>
            Crear una nueva historia
          </button>
        </section>
      )}
      
      {user?.books?.length > 0 && (
        <section className="mt-10 ">
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-700 pb-2">Mis Historias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {user.books.map((book, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                <div className="absolute top-2 left-2 w-12 h-12 flex items-center justify-center border-4 border-indigo-400 text-orange-400 text-xl bg-slate-700/75 font-bold rounded-full">{book.rating}</div>
                <img src={book.imageUrl} alt={book.title} className="w-full o h-60 object-cover rounded-md group-hover:opacity-75 transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition">
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded shadow" onClick={() => navigate("/readBook")}>Leer</button>
                    <button className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded shadow" onClick={() => navigate("/PageBook")}>Info</button>
                    {!book.published && (
                      <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded shadow" onClick={() => handlePublish(book)}>Publicar</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {user?.booksLibrary?.length > 0 && (
        <section >
          <h2 className="text-3xl font-bold mb-4 border-b-2 border-gray-700 pb-2">Mi Biblioteca</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {user.booksLibrary.map((book, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
                <div className="absolute top-2 left-2 w-12 h-12 flex items-center justify-center border-4 border-indigo-400 text-orange-400 text-xl bg-slate-700/75  font-bold rounded-full">{book.rating}</div>
                <img src={book.imageUrl} alt={book.title} className="w-full h-60 object-cover rounded-md group-hover:opacity-75 transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition">
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded shadow" onClick={() => navigate("/readBook")}>Leer</button>
                    <button className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded shadow" onClick={() => navigate("/PageBook")}>Info</button>
                    <button className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded shadow" onClick={() => {removeBookLibrary(book._id), location.reload()}}>Eliminar</button>
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
