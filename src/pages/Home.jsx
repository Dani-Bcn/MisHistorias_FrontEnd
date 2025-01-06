import React, { useEffect } from "react";
import gsap from "gsap";
import img from "/images/libro.png";

export default function Home() {
  useEffect(() => {
    // Evitar scroll al cargar la página
    window.scrollTo(0, 0);

    // Usar gsap.context para el control de animaciones
    const context = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to("#box", { 
        y: -300, 
        fontSize: "5em", 
        opacity: 1, 
        ease: "expo.in"
      })
      .to("#box1", { 
        y: 200, 
        fontSize: "5em", 
        opacity: 1, 
        delay: -0.5, 
        duration: 0.5
      })
      .to("#box2", { 
        x: 400, 
        fontSize: "5em", 
        opacity: 1, 
        ease: "expo.in", 
        duration: 0.5
      })
      .to("#box3", { 
        fontSize: "5em", 
        rotateY: 360, 
        opacity: 1, 
        duration: 1
      })
      .to("#text", { 
        opacity: 1, 
        x: 100, 
        ease: "expo.out", 
        delay: -0.2
      })
      .to("#text1", { 
        opacity: 1, 
        x: 100, 
        ease: "expo.out", 
        delay: -0.2
      })
      .to("#text2", { 
        opacity: 1, 
        x: 100, 
        ease: "expo.out", 
        delay: -0.2
      })
      .to("#text3", { 
        opacity: 1, 
        x: 100, 
        ease: "expo.out", 
        delay: -0.2
      })
      .to("#text4", { 
        opacity: 1, 
        x: 100, 
        ease: "expo.out", 
        delay: -0.2
      });
    });

    // Limpieza del contexto de GSAP
    return () => context.revert();
  }, []);

  return (
    <main className="absolute w-screen h-screen flex flex-col justify-center items-center overflow-hidden">
      <img src={img} alt="img-back-home" className="absolute brightness-[0.3] object-cover" />
      <div className="z-[50] w-screen -mt-72 ml-5 h-screen flex justify-center items-center text-white text-[0.4em] lg:text-[1em]">
        <h1 id="box" className="text-xl mt-[400px] z-[10]">Creamos &nbsp;</h1>
        <h1 id="box1" className="text-xl mt-[-600px] text-white opacity-0">una &nbsp;</h1>
        <h1 id="box2" className="text-2xl text-white ml-[-400px] mt-[-200px] opacity-0">historia &nbsp;</h1>
        <h1 id="box3" className="text-xl text-white ml-[390px] mt-[-200px] opacity-0">? &nbsp;</h1>
      </div>
      <div className="text-3xl text-white flex -ml-48 text-[1.3em] -mt-72 gap-5">
        <h3 id="text" className="opacity-0">Crea</h3>
        <h3 id="text1" className="opacity-0">Comparte</h3>
        <h3 id="text2" className="opacity-0">Lee</h3>
        <h3 id="text3" className="opacity-0">Opina</h3>
        <h3 id="text4" className="opacity-0">Puntúa</h3>
      </div>
    </main>
  );
}
