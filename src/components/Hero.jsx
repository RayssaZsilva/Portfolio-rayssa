import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
const Avatar3D = lazy(() => import("./Avatar3D"));
import CalendarioCard from "./CalendarioCard";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="hero container" id="home">

      <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >

        <span className="hero-badge">
          Olá, eu sou
        </span>

        <h1>
          Rayssa
          <br />
          <span>Silva</span>
        </h1>

        <h2>
          Desenvolvedora de Software em formação
        </h2>

        <span className="hero-focus">
          Front-end | Back-end | Inteligência Artificial
        </span>

        <p>
         Estudante de Ciência da Computação, com experiência prática no desenvolvimento de aplicações utilizando React, JavaScript, Python, FastAPI, SQL e integração de APIs. Tenho interesse em inteligência artificial, automação de processos e soluções orientadas a dados.
        </p>

        <div className="hero-buttons">

          <a
            href="#projetos"
            className="primary"
          >
            Ver Projetos
          </a>

          <a
            href="/Curriculo_Rayssa_Cardoso_Portfolio.pdf"
            className="secondary"
          >
            Download CV
          </a>

        </div>

        <div className="hero-social">

          <a
            href="https://github.com/RayssaZsilva"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub da Rayssa"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/rayssa-silva-034665208?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn da Rayssa"
          >
            <FaLinkedin />
          </a>

        </div>

      </motion.div>

      <motion.div
        className="hero-right"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >

        <div className="hero-glow"></div>

        <Suspense fallback={<div className="avatar3d" aria-label="Carregando coelho 3D" />}><Avatar3D /></Suspense>

        <div className="calendar-position">
          <CalendarioCard />
        </div>

      </motion.div>

    </section>
  );
}