import React, { useState } from "react";
import OpcionesValidaciones from "./OpcionesValidacion";
import { gestorLlamada } from "../data/classes";

export const Validacion = ({ validacion, index, respuestas }) => {
  const [validado, isValidado] = useState(null);

  const esRespuestaCorrecta = () => {
    isValidado(null);

    setTimeout(() => {
      if (gestorLlamada._respuestaCliente[index]._esCorrecta) {
        isValidado(true);
        gestorLlamada._validacionesCorrectas[index]=true
      } else {
        isValidado(false);
        gestorLlamada._validacionesCorrectas[index]=false
      }
    }, 200); // Esperar 200 milisegundos (0.2 segundos)
  };


  return (
    <div key={index} className="validacion-item">
      <div>
        <label>Pregunta: </label>
        <p>{validacion.nombre}</p>
        <OpcionesValidaciones options={respuestas[index]} id={index} />
        {validado === true ? (
          <span className="validado">Cliente validado!</span>
        ) : null}
        {validado === false ? (
          <span className="rechazado">Cliente no validado</span>
        ) : null}
      </div>
      <button type="button" onClick={() => esRespuestaCorrecta()}>
        Corroborar
      </button>
    </div>
  );
};
