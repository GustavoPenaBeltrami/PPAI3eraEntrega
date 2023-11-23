import React, { useState, useEffect } from 'react';
import { gestorLlamada } from '../data/classes';

function OpcionesValidaciones({ options, id}) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const tomarRespuesta = (resp,id) => {
    gestorLlamada.tomarRespuesta(resp,id)
  }

  useEffect(() => {
    if (selectedOption){
      tomarRespuesta(selectedOption,id)
    }
  }, [selectedOption]);

  return (
    <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Seleccione</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OpcionesValidaciones;




