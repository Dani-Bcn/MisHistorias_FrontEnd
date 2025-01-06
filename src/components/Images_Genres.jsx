import React from 'react';

// Cargar imágenes dinámicamente
const images = {
  aventuras: "/images/Caratula-aventuras.jpeg",
  accion: "/images/Caratula-accion.jpeg",
  clasico: "/images/Caratula-clasico.jpeg",
  infantil: "/images/Caratula-infantil.jpeg",
  comedia: "/images/Caratula-comedia.jpeg",
  policial: "/images/Caratula-policial.jpeg",
  romantico: "/images/Caratula-romantico.jpeg",
  thriller: "/images/Caratula-thriller.jpeg",
  terror: "/images/Caratula-terror.jpeg",
};

// Array de géneros con imágenes
export const arrayGenres = [
  { genre: "Aventuras", image: images.aventuras },
  { genre: "Acción", image: images.accion },
  { genre: "Infantil", image: images.infantil },
  { genre: "Terror", image: images.terror },
  { genre: "Clásico", image: images.clasico },
  { genre: "Thriller", image: images.thriller },
  { genre: "Policial", image: images.policial },
  { genre: "Romántico", image: images.romantico },
  { genre: "Comedia", image: images.comedia },
];
