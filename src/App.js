import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LayoutExample from "./LayoutExample";
import PathExample from "./PathExample";
import TSPExample from "./TSPExample";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 flex flex-col items-center p-6">
        {/* Header con navbar */}
        <header className="w-full bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center sm:justify-between">
          {/* Título alineado a la izquierda */}
          <h1 className="text-4xl font-extrabold text-white sm:text-left">
            Ejemplos de Templado Simulado
          </h1>

          {/* Navbar dentro del header */}
          <nav className="w-full sm:w-auto mt-4 sm:mt-0">
            <ul className="flex justify-center gap-6 sm:justify-end">
              <li>
                <Link
                  to="/layout"
                  className="text-white text-lg font-semibold hover:text-teal-400 transition duration-300 ease-in-out"
                >
                  Ejemplo de Disposición
                </Link>
              </li>
              <li>
                <Link
                  to="/tsp"
                  className="text-white text-lg font-semibold hover:text-teal-400 transition duration-300 ease-in-out"
                >
                  Problema del Viajante
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-6xl bg-white shadow-xl rounded-lg p-8">
          <Routes>
            <Route path="/layout" element={<LayoutExample />} />
            <Route path="/path" element={<PathExample />} />
            <Route path="/tsp" element={<TSPExample />} />
            <Route path="/" element={<h2 className="text-xl text-center text-gray-700">Elige un ejemplo para ver</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
