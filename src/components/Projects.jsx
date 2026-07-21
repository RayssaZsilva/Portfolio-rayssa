import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const projetos = [
    {
      titulo: "🏨 Achô",
      descricao:
        "Plataforma de busca de hospedagens com pesquisa por cidade, detalhes dos hotéis, favoritos, login, cadastro, perfil de usuário e persistência de dados com LocalStorage.",
      tecnologias: [
        "React",
        "TypeScript",
        "Vite",
        "React Router",
        "React Leaflet",
        "CSS",
        "LocalStorage",
      ],
      linkDemo: "https://acho-ten.vercel.app/",
      linkGithub: "COLE_AQUI_O_LINK_DO_REPOSITORIO",
      destaque: true,
    },
    {
      titulo: "🎓 TopUm",
      descricao:
        "Aplicativo para organizar tarefas escolares, acompanhar atividades e gerenciar prazos.",
      tecnologias: ["React", "Firebase", "Tailwind"],
      linkDemo: "",
      linkGithub: "",
    },
    {
      titulo: "🏪 Izipis",
      descricao:
        "Sistema PDV para minimercado com gerenciamento de produtos e vendas.",
      tecnologias: ["React", "JavaScript", "SQLite"],
      linkDemo: "https://acho-ten.vercel.app/",
      linkGithub: "https://github.com/RayssaZsilva/Acho.git",
    },
  ];

  return (
    <section id="projetos" className="projects container">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        viewport={{
          once: true,
        }}
      >
        <h2>Meus Projetos</h2>

        <div className="projects-grid">
          {projetos.map((projeto) => (
            <ProjectCard
              key={projeto.titulo}
              {...projeto}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}