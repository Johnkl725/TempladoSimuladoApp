import React, { useState, useEffect } from "react";

const ANCHO_PAGINA = 800;
const ALTO_PAGINA = 600;

const elementos = [
  { nombre: "Encabezado", ancho: 200, alto: 50 },
  { nombre: "Imagen", ancho: 300, alto: 200 },
  { nombre: "Párrafo", ancho: 400, alto: 100 },
];

const calcularEnergia = (diseno) => {
  let penalizacion = 0;
  for (let i = 0; i < diseno.length; i++) {
    for (let j = i + 1; j < diseno.length; j++) {
      const elemA = diseno[i];
      const elemB = diseno[j];
      if (
        elemA.x < elemB.x + elemB.ancho &&
        elemA.x + elemA.ancho > elemB.x &&
        elemA.y < elemB.y + elemB.alto &&
        elemA.y + elemA.alto > elemB.y
      ) {
        penalizacion += 1;
      }
    }
  }
  return penalizacion;
};

const generarVecino = (diseno) => {
  const nuevoDiseno = [...diseno];
  const indice = Math.floor(Math.random() * nuevoDiseno.length);
  nuevoDiseno[indice] = {
    ...nuevoDiseno[indice],
    x: Math.max(
      0,
      Math.min(ANCHO_PAGINA - nuevoDiseno[indice].ancho, nuevoDiseno[indice].x + (Math.random() > 0.5 ? 20 : -20))
    ),
    y: Math.max(
      0,
      Math.min(ALTO_PAGINA - nuevoDiseno[indice].alto, nuevoDiseno[indice].y + (Math.random() > 0.5 ? 20 : -20))
    ),
  };
  return nuevoDiseno;
};

const recocidoSimulado = async (disenoInicial, setDiseno, onComplete) => {
  let T = 100;
  const T_min = 0.01;
  const alfa = 0.9;

  let disenoActual = disenoInicial;
  let energiaActual = calcularEnergia(disenoActual);

  const ejecutarIteracion = async () => {
    if (T <= T_min) {
      onComplete(); // Llamar cuando el algoritmo termine
      return;
    }

    // Ejecutar tareas dependientes juntas en un bloque asincrónico
    const tareasDependientes = [];
    for (let i = 0; i < 100; i++) {
      tareasDependientes.push(
        new Promise((resolve) => {
          const vecinoDiseno = generarVecino(disenoActual);
          const energiaVecino = calcularEnergia(vecinoDiseno);

          const delta = energiaVecino - energiaActual;
          if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
            disenoActual = vecinoDiseno;
            energiaActual = energiaVecino;
          }

          resolve();
        })
      );
    }

    // Esperar a que todas las tareas dependientes terminen
    await Promise.all(tareasDependientes);

    setDiseno(disenoActual);
    T *= alfa; // Reducir la temperatura
    setTimeout(ejecutarIteracion, 100); // Continuar en la siguiente iteración
  };

  ejecutarIteracion();
};

function EjemploDiseno() {
  const [diseno, setDiseno] = useState([]);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    // Inicializa el diseño y ejecuta el algoritmo
    const ejecutarAlgoritmo = async () => {
      const disenoInicial = elementos.map((el) => ({
        ...el,
        x: Math.floor(Math.random() * (ANCHO_PAGINA - el.ancho)),
        y: Math.floor(Math.random() * (ALTO_PAGINA - el.alto)),
      }));

      setDiseno(disenoInicial);
      await recocidoSimulado(disenoInicial, setDiseno, ejecutarAlgoritmo); // Reiniciar el algoritmo al completarse
    };

    ejecutarAlgoritmo(); // Llamar al algoritmo por primera vez
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPaso((prevPaso) => prevPaso + 1);
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        El objetivo es colocarlos en una página de dimensiones 800x600 píxeles sin que se solapen entre sí
      </h2>
      {/* Contenedor centrado con imagen de fondo desde un enlace URL */}
      <div
        className="relative w-[800px] h-[600px] border-4 border-blue-500 flex justify-center items-center"
        style={{
          backgroundImage: "url('https://wallpaperswide.com/download/windows_xp_original-wallpaper-800x600.jpg')", // Usa cualquier URL de imagen
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {diseno.map((el, index) => (
          <div
            key={index}
            className="absolute bg-white border-2 border-black text-center text-xs p-2 rounded-lg shadow-lg"
            style={{
              width: el.ancho,
              height: el.alto,
              left: el.x,
              top: el.y,
            }}
          >
            <span className="text-blue-600 font-semibold">{el.nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EjemploDiseno;
