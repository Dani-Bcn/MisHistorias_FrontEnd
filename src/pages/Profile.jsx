import React, { useEffect, useState, useCallback } from "react";
import { profile, deleteBooks, deleteImg, removeBookLibrary, editBook } from "../api/auth";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Fetch user data with a dependency on user state
  useEffect(() => {
    const fetchUser = async () => {
      const res = await profile();
      setUser(res.data.userFound);
    };

    fetchUser();
  }, [user?.books?.length]); // Fetch again when the user books change

  const handlePublishToggle = useCallback(async (book) => {
    const updatedBook = { ...book, published: !book.published };
    await editBook(book._id, updatedBook);
    setUser(prevUser => ({
      ...prevUser,
      books: prevUser.books.map(b => b._id === book._id ? updatedBook : b),
    }));
  }, []);

  const deleteBook = useCallback(async (bookId, imageUrl) => {
    await deleteBooks(bookId);
    await deleteImg({ coco: imageUrl });
    setUser(prevUser => ({
      ...prevUser,
      books: prevUser.books.filter(b => b._id !== bookId),
    }));
    setDeletingBook(null); // Reset deletingBook state after deletion
  }, []);

  const removeBookFromLibrary = useCallback(async (bookId) => {
    const objectsId = { bookId, userId: user._id };
    await removeBookLibrary(objectsId);
    setUser(prevUser => ({
      ...prevUser,
      booksLibrary: prevUser.booksLibrary.filter(b => b._id !== bookId),
    }));
  }, [user]);

  const BookCard = ({ book, isLibrary = false }) => (
    <div key={book._id} className="w-60 h-40 flex flex-col text-white border-l border-t border-orange-600 rounded-l-xl rounded-bl-none px-5">
      <div className="w-full relative">
        <h2 className="text-2xl w-96 py-3 font-semibold">
          {book.title[0]}
          {book.title.slice(1)}
        </h2>
        <div className="flex">
          <img src={book.imageUrl} alt={book.title} className="w-32 h-52 object-cover" />
          <p className="absolute w-16 h-16 flex justify-center items-center mt-36 -ml-5 text-4xl text-orange-400 z-[100] border-[3px] border-blue-600 rounded-full bg-black">
            {book.rating}
          </p>
          <div className="m-5 h-48 flex flex-col gap-2 border-b border-r rounded-l-none rounded-b-xl border-orange-600 px-5">
            <button className="btn w-12 flex justify-start" onClick={() => navigate("/readBook",book._id)}>Leer</button>
            <button className="btn w-10 flex justify-start" onClick={() => navigate("/PageBook",book._id)}>Info</button>
            {!isLibrary && (
              <>
                <button className="btn w-32 flex justify-start" onClick={() => handlePublishToggle(book)}>
                  {book.published ? 'Dejar de publicar' : 'Publicar'}
                </button>
                <button className="btn w-28 flex justify-start" onClick={() => setDeletingBook(book._id)}>
                  Eliminar libro
                </button>
              </>
            )}
            {deletingBook === book._id && (
              <div className="text-red-600">
                <h3>¿Seguro que quieres eliminar este libro?</h3>
                <div className="w-full flex gap-10">
                  <p
                    className="text-xl text-green-600 cursor-pointer font-black"
                    onClick={() => deleteBook(book._id, book.imageUrl)}
                  >
                    Sí
                  </p>
                  <p
                    className="text-xl text-red-600 cursor-pointer font-black"
                    onClick={() => setDeletingBook(null)}
                  >
                    No
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <main className="w-screen flex flex-col gap-10 justify-center items-center">
      <section className="relative flex flex-col justify-center items-center mt-48">
        <div className="absolute w-72 h-72 -mx-5 -mt-5 bg-green-400/[0.5] blur-xl shadow-[0px_0px_20px] shadow-black rounded-3xl rotate-45"></div>
        <div className="absolute w-72 h-72 -mx-5 -mt-5 bg-blue-400/[0.3] blur-xl shadow-[0px_0px_10px] shadow-black rounded-3xl scale-[1.2] rotate-45"></div>
        <div className="relative -mt-20 py-5 flex gap-2 text-5xl text-white">
          <h2 className="font-bold">{user.userName}</h2>
          <h2>{user.lastName}</h2>
        </div>
        <img src={user.imageUserUrl} alt={user.userName} className="relative w-60 h-60 border-8 object-cover object-top border-orange-400 rounded-full" />
        <div className="relative flex gap-72 justify-center items-center text-white z-10">
          <button className="btn text-3xl" onClick={() => navigate("/createBook")}>
            Crear una nueva historia
          </button>
        </div>
      </section>

      {user.books.length > 0 && (
        <section className="w-full pr-40 pl-20 mb-32 mt-20">
          <h2 className="text-3xl font-bold text-white my-5">Mis Historias</h2>
          <div className="flex gap-64 flex-wrap py-10">
            {user.books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      {user.booksLibrary.length > 0 && (
        <section className="w-full pr-32 pl-20 mb-32">
          <h2 className="text-3xl font-bold text-white my-5">Mi Biblioteca</h2>
          <div className="flex gap-64 py-10 flex-wrap">
            {user.booksLibrary.map((book) => (
              <BookCard key={book._id} book={book} isLibrary />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default UserProfile;
