import React, { useEffect, useState } from "react";
import { profile } from "../api/auth";
import { useNavigate } from "react-router-dom";  // Asegúrate de tener esto si estás utilizando react-router-dom.

export default function EditUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Hook para redirigir si no está autorizado

  // Función para obtener el usuario
  const getUser = async () => {
    try {
      window.scrollTo(0, 0);
      const res = await profile();

      // Verificación de autorización
      if (res.data.message === "No autorizado") {
        navigate("/");
        return;
      }

      if (res?.data?.userFound) {
        setUser(res.data.userFound);
      } else {
        setError("No se pudo encontrar al usuario.");
      }
    } catch (err) {
      setError("Hubo un error al cargar los datos del usuario.");
    } finally {
      setLoading(false);
    }
  };

  // Llamada a getUser al cargar el componente
  useEffect(() => {
    getUser();
  }, []);

  // Renderizado condicional mientras se carga o si hay error
  if (loading) {
    return <div className="text-center text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <main className="w-screen h-96 mt-20 items-center flex">
      {user ? (
        <section className="w-full flex flex-col gap-5 justify-center items-center text-white text-3xl">
          <img
            className="rounded-full border-8 border-orange-400"
            src={user.imageUserUrl}
            alt="image_user"
          />
          <h2 className="text-5xl">
            <span>{user.userName[0]}</span>{user.userName.slice(1)}
          </h2>
          <h3 className="text-5xl">
            <span>{user.lastName[0]}</span>{user.lastName.slice(1)}
          </h3>
          <h4>Miembro desde</h4>
          <p>{user.createdAt.slice(0, 10)}</p>
          <h3>Historias</h3>
        </section>
      ) : (
        <div>No se encontraron datos del usuario.</div>
      )}
    </main>
  );
}
