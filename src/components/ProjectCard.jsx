import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";

export default function ProjectCard({
  titulo,
  descricao,
  tecnologias,
  linkDemo,
  linkGithub,
  destaque = false,
}) {
  return (
    <motion.article
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`project-card ${
        destaque ? "project-card-featured" : ""
      }`}
    >
      <div className="project-glow" />

      {destaque && (
        <span className="project-highlight">
          Projeto em destaque
        </span>
      )}

      <h3>{titulo}</h3>

      <p>{descricao}</p>

      <div className="techs">
        {tecnologias.map((tech) => (
          <span key={tech}>
            {tech}
          </span>
        ))}
      </div>

      {(linkDemo || linkGithub) && (
        <div className="project-links">
          {linkDemo && (
            <a
              href={linkDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-demo"
              aria-label={`Acessar demonstração do projeto ${titulo}`}
            >
              <FiExternalLink />
              Acessar
            </a>
          )}

          {linkGithub && (
            <a
              href={linkGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-github"
              aria-label={`Abrir repositório do projeto ${titulo}`}
            >
              <FiGithub />
              Repositório
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}