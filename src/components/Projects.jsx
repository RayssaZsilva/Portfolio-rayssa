import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const projetos = [

    {
      titulo: "rAI",
      logo: "https://img.icons8.com/?size=100&id=45060&format=png&color=000000",
      descricao:
      "Chatbot integrado ao portfolio para responder perguntas sobre a minha formação e é limitado as informações alimentadas, não inventa respostas",
      tecnologias: [ 
        "React.js",
        "JavaScript",
        "Python",
        "FastAPI",
        "Google Gemini API",
        "Vercel",
        "Rest API/HTTP",
        "JSON",
        "proteção da chave da API"

      ],


    },
    {
      titulo: "Achô",
      logo: "https://img.icons8.com/?size=100&id=64714&format=png&color=000000",
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
      linkGithub: "https://github.com/RayssaZsilva/Acho/blob/main/README.md",
      destaque: true,
    },
    {
      titulo: "TopUm",
      logo: "https://img.icons8.com/?size=100&id=109679&format=png&color=000000",
      descricao:
        "Aplicativo para organizar tarefas escolares, acompanhar atividades e gerenciar prazos. Desenvolvido em grupo",
      tecnologias: ["React", "Firebase", "Tailwind"],
      linkGithub: "https://github.com/RayssaZsilva",
    },
    {
      titulo: "Izipis",
      logo:"https://img.icons8.com/?size=100&id=108565&format=png&color=000000",
      descricao:
        "Sistema PDV para minimercado com gerenciamento de produtos e vendas.",
      tecnologias: ["React", "JavaScript", "SQLite"],
      linkGithub: "https://github.com/Engenharia-de-Requisitos-CIC-5/Izipis.git",
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