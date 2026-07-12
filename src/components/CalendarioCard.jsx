import React, { useState, useEffect } from 'react';
import { MdOutlineCalendarMonth } from "react-icons/md";

export default function CalendarioCard() {
  const [hora, setHora] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    const atualizarHorario = () => {
      const agora = new Date();
      
      // Formata a hora (ex: 23:05)
      setHora(agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      
      // Formata a data por extenso (ex: terça-feira, 16 de junho de 2026)
      setData(agora.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }));
    };

    atualizarHorario();
    const intervalo = setInterval(atualizarHorario, 1000); // Atualiza a hora a cada segundo

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="calendar-card">
      <div className="calendar-card-header">
        <MdOutlineCalendarMonth size={50} color="#a78bfa" />
        <span> Hoje</span>
      </div>
      <h3 className="calendar-card-date">{data} </h3>
      <h2 className="calendar-card-time">{hora}</h2>
    </div>
  );
}
