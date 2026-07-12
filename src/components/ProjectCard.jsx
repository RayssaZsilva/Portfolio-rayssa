import { motion } from "framer-motion";
import { FiExternalLink, FiGithub } from "react-icons/fi"; // Certifique-se de ter rodado npm install react-icons

export default function ProjectCard({
  titulo,
  descricao,
  tecnologias,
  linkDemo,    // Adicionado aqui para o React reconhecer o link
  linkGithub   // Adicionado aqui para o React reconhecer o link
}) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02
      }}
      transition={{
        duration: .3
      }}
      className="project-card"
    >
      <div className="project-glow"/>

      <h3>
        {titulo}
      </h3>

      <p>
        {descricao}
      </p>

      <div className="techs">
        {
          tecnologias.map((tech) => (
            <span key={tech}>
              {tech}
            </span>
          ))
        }
      </div>

      <div className="project-links">
        
        <a href={linkDemo || "#"} target="_blank" rel="noopener noreferrer" className="btn-demo">
          <FiExternalLink /> Acessar
        </a>

        <a href={linkGithub || "#"} target="_blank" rel="noopener noreferrer" className="btn-github">
          <FiGithub /> Repositório
        </a>

      </div>

    </motion.div>
  );
}