import { motion } from "framer-motion";

import ProjectCard from "./ProjectCard";

export default function Projects() {

  const projetos = [

    {

      titulo: "🎓 TopUm",

      descricao:

      "Aplicativo para organizar tarefas escolares, acompanhar atividades e gerenciar prazos.",

      tecnologias: [

        "React",

        "Firebase",

        "Tailwind"

      ]

    },

    {

      titulo: "🏪 Izipis",

      descricao:

      "Sistema PDV para mini mercado com gerenciamento de produtos e vendas.",

      tecnologias: [

        "React",

        "JavaScript",

        "SQLite"

      ]

    }

  ];

  return (

    <section

      id="projetos"

      className="projects container"

    >

      <motion.div

        initial={{

          opacity:0,

          y:40

        }}

        whileInView={{

          opacity:1,

          y:0

        }}

        transition={{

          duration:.8

        }}

        viewport={{

          once:true

        }}

      >

        <h2>

          Meus Projetos

        </h2>

        <div className="projects-grid">

          {

            projetos.map((projeto)=>(

              <ProjectCard

                key={projeto.titulo}

                {...projeto}

              />

            ))

          }

        </div>

      </motion.div>

    </section>

  );
}