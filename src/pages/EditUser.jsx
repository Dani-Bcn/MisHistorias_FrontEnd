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
    window.scrollTo(0, 0);
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
    return <div className="page-shell text-center text-white">Cargando...</div>;
  }

  if (error) {
    return <div className="page-shell text-center text-red-300">{error}</div>;
  }

  return (
    <main className="page-shell flex items-center">
      {user ? (
        <section className="section-card mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-5 text-center text-white">
          <img
            className="h-40 w-40 rounded-full border-4 border-orange-300 object-cover shadow-2xl shadow-orange-500/20"
            src={user.imageUserUrl}
            alt="image_user"
          />
          <h2 className="text-5xl font-bold">
            <span>{user.userName[0]}</span>{user.userName.slice(1)}
          </h2>
          <h3 className="text-4xl text-slate-200">
            <span>{user.lastName[0]}</span>{user.lastName.slice(1)}
          </h3>
          <div className="divider-glow"></div>
          <h4 className="text-sm uppercase tracking-[0.25em] text-orange-200">Miembro desde</h4>
          <p className="text-slate-300">{user.createdAt.slice(0, 10)}</p>
          <h3 className="text-2xl font-semibold">Historias</h3>
        </section>
      ) : (
        <div>No se encontraron datos del usuario.</div>
      )}
    </main>
  );
}
