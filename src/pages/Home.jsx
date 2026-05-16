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
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 px-4">
      <img src={img} alt="img-back-home" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/70 to-slate-950"></div>
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"></div>
      <div className="z-[50] flex h-screen w-full items-center justify-center text-[0.42em] font-black text-white sm:text-[0.62em] lg:text-[1em]">
        <h1 id="box" className="mt-[400px] text-xl drop-shadow-2xl">¿ Creamos &nbsp;</h1>
        <h1 id="box1" className="mt-[-600px] text-xl text-white opacity-0 drop-shadow-2xl">una &nbsp;</h1>
        <h1 id="box2" className="ml-[-400px] mt-[-200px] text-2xl text-white opacity-0 drop-shadow-2xl">historia &nbsp;</h1>
        <h1 id="box3" className="ml-[390px] mt-[-200px] text-xl text-white opacity-0 drop-shadow-2xl">? &nbsp;</h1>
      </div>
      <div className="z-[60] -mt-72 flex flex-wrap justify-center gap-3 text-[1.05em] font-semibold text-slate-100 sm:gap-5 sm:text-3xl">
        <h3 id="text" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 opacity-0 backdrop-blur">Crea</h3>
        <h3 id="text1" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 opacity-0 backdrop-blur">Comparte</h3>
        <h3 id="text2" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 opacity-0 backdrop-blur">Lee</h3>
        <h3 id="text3" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 opacity-0 backdrop-blur">Opina</h3>
        <h3 id="text4" className="rounded-full border border-white/10 bg-white/10 px-4 py-2 opacity-0 backdrop-blur">Puntúa</h3>
      </div>
    </main>
  );
}
