import axios from "axios";

// Crear instancia de Axios
const axiosInstance = axios.create({
  baseURL: "https://mis-historias-back-end.vercel.app", // Cambiar a la URL de producción según el entorno
  withCredentials: true,
});

//"https://mis-historias-back-end.vercel.app"

// Función para manejar errores
const handleError = (error) => {
  console.error(error);
  throw error;
};

// Eliminar libro de biblioteca
export const removeBookLibrary = async (objectIds) => {
  try {
    return await axiosInstance.put(
      `/api/removeBookLibrary/${objectIds.userId}/${objectIds.bookId}`
    );
  } catch (error) {
    handleError(error);
  }
};

// Obtener libro
export const getBook = async (bookId) => {
  try {
    return await axiosInstance.get(`/api/getBook/${bookId}`);
  } catch (error) {
    handleError(error);
  }
};

// Registro de usuario
export const registerUser = async (values) => {
  try {
    return await axiosInstance.post("/api/registerUser", values);
  } catch (error) {
    handleError(error);
  }
};

// Crear libro
export const createBook = async (values) => {
  try {
    return await axiosInstance.post("/api/createBook", values);
  } catch (error) {
    handleError(error);
  }
};

// Editar usuario
export const editUser = async (id, values) => {
  try {
    return await axiosInstance.put(`/api/editUser/${id}`, values);
  } catch (error) {
    handleError(error);
  }
};

// Login usuario
export const loginUser = async (user) => {
  try {
    return await axiosInstance.post("/api/loginUser", user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleError(error);
  }
};

// Cerrar sesión usuario
export const logout = async () => {
  try {
    const response = await axiosInstance.post("/api/logoutUser");
    setTimeout(() => {
      location.reload();
    }, 100);
    return response;
  } catch (error) {
    handleError(error);
  }
};

// Obtener perfil de usuario
export const profile = async () => {
  try {
    return await axiosInstance.get("/api/profile", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    handleError(error);
  }
};

// Obtener ID de usuario
export const getIdUser = async () => {
  try {
    return await axiosInstance.post("/api/getIdUser");
  } catch (error) {
    handleError(error);
  }
};

// Obtener libros del usuario
export const booksUser = async (idUser) => {
  try {
    return await axiosInstance.get(`/api/booksUser/${idUser}`);
  } catch (error) {
    handleError(error);
  }
};

// Buscar libros
export const searchBooks = async (values) => {
  try {
    return await axiosInstance.post("/api/searchBooks", values);
  } catch (error) {
    handleError(error);
  }
};

// Obtener todos los libros
export const getAllBooks = async () => {
  try {
    return await axiosInstance.get("/api/getAllBooks");
  } catch (error) {
    handleError(error);
  }
};

// Eliminar libro
export const deleteBooks = async (id) => {
  try {
    return await axiosInstance.post(`/api/deleteBook/${id}`);
  } catch (error) {
    handleError(error);
  }
};

// Editar libro
export const editBook = async (id, values) => {
  try {
    return await axiosInstance.put(`/api/editBook/${id}`, values);
  } catch (error) {
    handleError(error);
  }
};

// Agregar libro a la biblioteca
export const addBook = async (objectIds) => {
  try {
    return await axiosInstance.put(
      `/api/addBook/${objectIds.userId}/${objectIds.bookId}`
    );
  } catch (error) {
    handleError(error);
  }
};

// Subir imagen
export const uploadImg = async (values, imageUrl) => {
  try {
    return await axiosInstance.post("/api/uploadImg", { values, imageUrl });
  } catch (error) {
    handleError(error);
  }
};

// Eliminar imagen
export const deleteImg = async (url) => {
  try {
    return await axiosInstance.post("/api/deleteImg", { url });
  } catch (error) {
    handleError(error);
  }
};

// Eliminar capítulo
export const removeChapter = async (values) => {
  try {
    return await axiosInstance.delete(`/api/removeChapter/${values}`);
  } catch (error) {
    handleError(error);
  }
};
