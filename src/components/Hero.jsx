import { motion } from "framer-motion";

import Avatar3D from "./Avatar3D";

import CalendarCard from "./CalendarioCard.jsx";

export default function Hero() {

  return (

    <section className="hero container">

      <div className="hero-left">

        <motion.h1

          initial={{ opacity: 0, y: 40 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 1 }}

        >

          Bem-vindo ao meu portfólio

        </motion.h1>

        <motion.h2

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ delay: 0.4 }}

        >

          Rayssa Silva

        </motion.h2>

        <motion.p

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

          transition={{ delay: 0.7 }}

        >

          Desenvolvedora em formação.

        </motion.p>

        <div className="hero-buttons">

          <a href="#projetos">

            <button className="primary">

              Ver Projetos

            </button>

          </a>

          <a href="#sobre">

            <button className="secondary">

              Sobre Mim

            </button>

          </a>

        </div>

        <CalendarCard />

      </div>

      <div className="hero-right">

        <Avatar3D />

      </div>

    </section>

  );
}