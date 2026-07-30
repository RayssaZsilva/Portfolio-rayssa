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
        transition={{ duration: .8 }}
      >

        <span className="hero-badge">
          👋 Olá, eu sou
        </span>

        <h1>
          Rayssa
          <br />
          <span>Silva</span>
        </h1>

        <h2>
          Desenvolvedora Front-end
        </h2>

        <p>
          Estudante de Ciência da Computação apaixonada por criar
          interfaces modernas, responsivas e experiências que unem
          design e tecnologia.
        </p>

        <div className="hero-buttons">

          <a
            href="#projects"
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

          <a href="#">
            <FaGithub />
          </a>

          <a href="#">
            <FaLinkedin />
          </a>

        </div>

      </motion.div>

      <motion.div
        className="hero-right"
        initial={{ opacity:0, scale:.8 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:1 }}
      >

        <div className="hero-glow"></div>

        <Avatar3D />

        <div className="calendar-position">
          <CalendarioCard/>
        </div>

      </motion.div>

    </section>
  );
}