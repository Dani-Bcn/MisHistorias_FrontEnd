import axios from "axios";
import Cookies from "js-cookie";


const axxios = axios.create({
  baseURL: "https://mis-historias-back-end.vercel.app",
  withCredentials: true,
});

const cookie = Cookies()
//Eliminar libro de biblioteca
export const removeBookLibrary = async (objectIds) =>
  await axxios.put(
    `/api/removeBookLibrary/${objectIds.userId}/${objectIds.bookId}`
  );
  
//Obtener libro
export const getBook = async (bookId) =>
  await axxios.get(`/api/getBook/${bookId}`);

// Registro de usuario
export const registerUser = async (values) =>
  await axxios.post("/api/registerUser", values);

//Crear libro
export const createBook = async (values) =>
  await axxios.post("/api/createBook", values);

//Editar usuario
export const editUser = async (id, values) =>
  await axxios.put(`/api/editUser/${id}`, values);

// Login Usuario
export const loginUser = async (user) =>
  await axxios.post("/api/loginUser", user, {
    credentials: "include",
    withCredentials: true, // Esto asegura que la cookie se envíe con la solicitud
    headers: {
      "Content-Type": "application/json",
    },   
  });

 //Cerrar sesión usuario 
 export const logout = async ()=> {
  await axxios.post("/api/logoutUser")
};

//Obtener perfil usuario
export const profile = async () =>
  await axxios.get("/api/profile", {
    credentials: "include",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

//Obtener id de usuario
export const getIdUser = async () => await axxios.post("/api/getIdUser");

//?
export const booksUser = async (idUser) =>
  await axxios.get("/api/booksUser/", idUser);

//Buscar libros
export const searchBooks = async (values) =>
  await axxios.post("/api/searchBooks", values);

//Todos los libros
export const getAllBooks = async () => await axxios.get(`/api/getAllBooks`);

//Eliminar libro
export const deleteBooks = async (id) =>
  await axxios.post(`/api/deleteBook/${id}`);

//Editar libro
export const editBook = async (id, values) =>
  await axxios.put(`/api/editBook/${id}`, values);

//Agregar libro a biblioteca
export const addBook = async (objectIds) =>
  await axxios.put(`/api/addBook/${objectIds.userId}/${objectIds.bookId}`);

//Subir imagen
export const uploadImg = async (values, imageUrl) =>
  await axxios.post(`/api/uploadImg`, values, imageUrl);

//Eliminar imagen
export const deleteImg = async (url) => {
  await axxios.post(`/api/deleteImg`, url);
};

//Eliminar capítulo
export const removeChapter = async (values) =>
  await axxios.delete(`/api/removeChapter/${values}`);
