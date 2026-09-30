import { motion } from "framer-motion";
import Avatar3D from "./Avatar3D";
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
          Front-end & Backend
        </span>

        <p>
          Estudante de Ciência da Computação, desenvolvendo aplicações
          com React, JavaScript, Python, FastAPI, SQL e APIs, com interesse
          em evoluir também na área de dados.
        </p>

        <div className="hero-buttons">

          <a
            href="https://github.com/repos?q=owner%3A%40me"
            className="primary"
          >
            Ver Projetos
          </a>

          <a
            href="/curriculo.pdf"
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

        <Avatar3D />

        <div className="calendar-position">
          <CalendarioCard />
        </div>

      </motion.div>

    </section>
  );
}