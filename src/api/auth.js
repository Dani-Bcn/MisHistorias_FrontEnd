import axios from "axios";
const VITE_PORT = import.meta.env.VITE_PORT;



const axxios = axios.create({
  baseURL: "https://mis-historias-back-end.vercel.app" ,
  withCredentials: true,
});

export const getBook = async (bookId) =>   await axxios.get(`/api/getBook/${bookId}`);
export const registerUser = async (values) =>
  await axxios.post("/api/registerUser", values);
export const createBook = async (values) =>
  await axxios.post("/api/createBook", values); 
export const editUser = async (id,values) => 
  await axxios.put(`/api/editUser/${id}`,values);
export const loginUser = async (user) =>
  await axxios.post("/api/loginUser", user);
export const logout = async (user) =>
  await axxios.post("/api/logoutUser", user);
export const profile = async () => await axxios.get("/api/profile");
export const getIdUser = async () => await axxios.post("/api/getIdUser");
export const booksUser = async (idUser) =>
  await axxios.get("/api/booksUser/", idUser);
export const searchBooks = async (values) =>
  await axxios.post("/api/searchBooks", values);
export const getAllBooks = async () => await axxios.get(`/api/getAllBooks`);
export const getAllUsers = async () => await axxios.get(`/api/getAllUsers`);
export const deleteBooks = async (id) =>
  await axxios.delete(`/api/deleteBook/${id}`);
export const editBook = async (id,values) =>
  await axxios.put(`/api/editBook/${id}`,values);
export const addBook = async (objectIds) =>
  await axxios.put(`/api/addBook/${objectIds.userId}/${objectIds.bookId}`);
export const addImg = async (formData) =>
  await axxios.post(`/api/addImg/`,formData);
 
export const uploadImg = async (values,imageUrl) =>
  await axxios.post(`/api/uploadImg`,values,imageUrl); 

export const savePage = async (page) =>
  await axxios.post(`/api/savePage`,page); 



 

