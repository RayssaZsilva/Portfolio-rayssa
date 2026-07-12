import { motion } from "framer-motion";

import SkillBar from "./SkillBar";

export default function Skills() {

  const skills = [

    {

      nome: "HTML",

      porcentagem: 90

    },

    {
      nome: "Python",
      porcentagem: 70,
    },

    {

      nome: "CSS",

      porcentagem: 85

    },

    {

      nome: "JavaScript",

      porcentagem: 80

    },

    {

      nome: "React",

      porcentagem: 75

    },

    {
      nome: "Next.js",
      porcentagem:70,
    },

    {
      nome: "Tailwind",
      porcentagem: 80,
     },

   {

      nome: "TypeScript",
      porcentagem:  75

    },

    {
      nome: "PHP",
      porcentagem: 50
    },

    {
      nome: "SQL",

      porcentagem: 75
    },

    {
      nome: "Django",
      porcentagem: 50,
    },

    {
      nome: "Git",
      porcentagem:90,
    
    },

    {
      nome: "Github",
      porcentagem: 80,
    }




  ];

  return (

    <section

      id="habilidades"

      className="skills container"

    >

      <motion.div

        initial={{ opacity: 0, y: 40 }}

        whileInView={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        viewport={{ once: true }}

      >

       
        <div className="skills-card">
          
          <h1>
            Tecnologias
          </h1>
            
          <h2>
            Habilidades
         </h2>


          {

            skills.map((skill) => (

              <SkillBar

                key={skill.nome}

                nome={skill.nome}

                porcentagem={skill.porcentagem}

              />

            ))

          }

        </div>

      </motion.div>

    </section>

  );
}