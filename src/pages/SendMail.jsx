// frontend/src/components/EnviarCorreo.jsx
import { useState } from 'react';
import axios from 'axios';

export default function EnviarCorreo() {

    const axxios = axios.create({
        baseURL:
        process.env.NODE_ENV === "production"
        ? "https://mis-historias-back-end.vercel.app"
        : "http://localhost:8000",
      withCredentials: true,
      });

  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axxios.post('/api/send-email', formData);
      console.log(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Hubo un error al enviar el correo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-40 p-4 flex flex-col gap-2 max-w-md mx-auto">
      <input
        name="to"
        type="email"
        placeholder="Correo destino"
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        name="subject"
        type="text"
        placeholder="Asunto"
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <textarea
        name="text"
        placeholder="Mensaje"
        onChange={handleChange}
        required
        className="border p-2 rounded min-h-[100px]"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Enviar correo
      </button>
    </form>
  );
}
