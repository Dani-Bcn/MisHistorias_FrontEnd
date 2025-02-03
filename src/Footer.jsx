export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 z-[200]">
      <div className="container mx-auto text-center">
        <p className="text-lg font-semibold">Creamos una historia</p>
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Daniel Pérez Aranda. Todos los
          derechos reservados.
        </p>
        <div className=" z-[100] flex justify-center mt-4 space-x-4">
        </div>
      </div>
    </footer>
  );
}
