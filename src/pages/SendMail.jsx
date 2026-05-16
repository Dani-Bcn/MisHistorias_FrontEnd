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
    <form onSubmit={handleSubmit} className="section-card mx-auto mt-32 flex max-w-md flex-col gap-4">
      <h1 className="text-center text-3xl font-bold text-white">Enviar correo</h1>
      <input
        name="to"
        type="email"
        placeholder="Correo destino"
        onChange={handleChange}
        required
        className="bg-slate-950/60"
      />
      <input
        name="subject"
        type="text"
        placeholder="Asunto"
        onChange={handleChange}
        required
        className="bg-slate-950/60"
      />
      <textarea
        name="text"
        placeholder="Mensaje"
        onChange={handleChange}
        required
        className="min-h-[120px] bg-slate-950/60"
      />
      <button type="submit" className="btn-primary">
        Enviar correo
      </button>
    </form>
  );
}
