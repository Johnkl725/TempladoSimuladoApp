import React, { useState, useEffect } from "react"; 

const ciudades = [
  { nombre: "A", x: 100, y: 200 },
  { nombre: "B", x: 300, y: 400 },
  { nombre: "C", x: 500, y: 100 },
  { nombre: "D", x: 700, y: 300 },
  { nombre: "E", x: 200, y: 500 },
  { nombre: "F", x: 400, y: 200 },
  { nombre: "G", x: 600, y: 400 },
  { nombre: "H", x: 800, y: 100 },
  { nombre: "I", x: 100, y: 600 },
  { nombre: "J", x: 300, y: 100 },
];

const calcularDistancia = (ciudad1, ciudad2) => {
  return Math.sqrt(Math.pow(ciudad1.x - ciudad2.x, 2) + Math.pow(ciudad1.y - ciudad2.y, 2));
};

const calcularDistanciaTotal = (ruta) => {
  let distanciaTotal = 0;
  for (let i = 0; i < ruta.length - 1; i++) {
    distanciaTotal += calcularDistancia(ruta[i], ruta[i + 1]);
  }
  distanciaTotal += calcularDistancia(ruta[ruta.length - 1], ruta[0]); // Volver a la ciudad inicial
  return distanciaTotal;
};

const generarRutaVecina = (ruta) => {
  const nuevaRuta = [...ruta];
  const indice1 = Math.floor(Math.random() * nuevaRuta.length);
  const indice2 = (indice1 + 1 + Math.floor(Math.random() * (nuevaRuta.length - 1))) % nuevaRuta.length;
  [nuevaRuta[indice1], nuevaRuta[indice2]] = [nuevaRuta[indice2], nuevaRuta[indice1]];
  return nuevaRuta;
};

const templadoSimulado = async (rutaInicial, actualizarRuta, actualizarDistancia, actualizarT, parametros) => {
  let { T, T_min, alfa, maxIteraciones } = parametros;
  let iteraciones = 0;

  let rutaActual = rutaInicial;
  let distanciaActual = calcularDistanciaTotal(rutaActual);

  let mejorRuta = [...rutaActual];
  let mejorDistancia = distanciaActual;

  const ejecutarIteracion = async () => {
    if (T <= T_min || iteraciones >= maxIteraciones) {
      actualizarRuta(mejorRuta);
      actualizarDistancia(mejorDistancia);
      return;
    }

    for (let i = 0; i < 10; i++) {
      const rutaVecina = generarRutaVecina(rutaActual);
      const distanciaVecina = calcularDistanciaTotal(rutaVecina);

      const delta = distanciaVecina - distanciaActual;
      if (delta < 0 || Math.random() < Math.exp(-delta / T)) {
        rutaActual = rutaVecina;
        distanciaActual = distanciaVecina;

        if (distanciaActual < mejorDistancia) {
          mejorRuta = [...rutaActual];
          mejorDistancia = distanciaActual;
        }
      }
    }

    actualizarRuta(rutaActual);
    actualizarDistancia(distanciaActual);
    actualizarT(T);

    T *= alfa; // Reducir la temperatura
    iteraciones++;

    // Esperar un poco antes de la siguiente iteración para no bloquear el hilo principal
    await new Promise((resolve) => setTimeout(resolve, 100));
    ejecutarIteracion();
  };

  ejecutarIteracion();
};

function EjemploTSP() {
  const [ruta, actualizarRuta] = useState([]);
  const [distancia, actualizarDistancia] = useState(0);
  const [temperatura, actualizarT] = useState(0);
  const [trazado, setTrazado] = useState([]);

  useEffect(() => {
    const parametros = {
      T: 1000, // Temperatura inicial
      T_min: 0.01, // Temperatura mínima
      alfa: 0.95, // Factor de enfriamiento
      maxIteraciones: 10000, // Número máximo de iteraciones
    };

    const rutaInicial = [...ciudades].sort(() => Math.random() - 0.5);
    actualizarT(parametros.T);
    templadoSimulado(rutaInicial, actualizarRuta, actualizarDistancia, actualizarT, parametros);
  }, []);

  useEffect(() => {
    if (ruta.length > 0) {
      const lineas = ruta.map((ciudad, indice) => {
        const siguienteCiudad = ruta[(indice + 1) % ruta.length];
        return { x1: ciudad.x, y1: ciudad.y, x2: siguienteCiudad.x, y2: siguienteCiudad.y };
      });

      setTrazado(lineas);
    }
  }, [ruta]);

  const mostrarComportamiento = () => {
    for (let i = 0; i < ruta.length; i++) {
      const ciudad = ruta[i];
      const ciudadElemento = document.getElementById(`ciudad-${ciudad.nombre}`);
      ciudadElemento.style.transition = "all 0.5s ease-in-out";
      ciudadElemento.style.backgroundColor = i === 0 ? "red" : "blue"; // Resaltar la primera ciudad en rojo
    }
  };

  useEffect(() => {
    mostrarComportamiento();
  }, [ruta]);

  return (
    <div className="p-0.5 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Problema del Viajante de Comercio</h2>
      <p className="text-xl font-semibold text-gray-800 mb-4">Temperatura Actual: {temperatura.toFixed(2)}</p>
      <p className="text-xl font-semibold text-gray-800 mb-4">Distancia Total: {distancia.toFixed(2)} unidades</p>
      <div className="relative w-[800px] h-[600px] border border-gray-300 bg-gray-100">
        {ruta.map((ciudad, indice) => (
          <div
            id={`ciudad-${ciudad.nombre}`}
            key={indice}
            className={`absolute border border-black rounded-full ${indice === 0 ? "bg-red-500" : "bg-blue-500"} text-white flex items-center justify-center`}
            style={{
              width: 30,
              height: 30,
              left: ciudad.x - 15,
              top: ciudad.y - 15,
            }}
          >
            {ciudad.nombre}
          </div>
        ))}

        <svg className="absolute top-0 left-0 w-full h-full">
          {trazado.map((linea, index) => (
            <line
              key={index}
              x1={linea.x1}
              y1={linea.y1}
              x2={linea.x2}
              y2={linea.y2}
              stroke={index === 0 ? "red" : "black"}
              strokeWidth="2"
              style={{ transition: "all 0.5s ease-in-out" }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default EjemploTSP;
