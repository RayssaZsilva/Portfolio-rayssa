import { motion } from "framer-motion";

export default function About() {

  return (

    <section id="sobre" className="about container">

      <motion.div

        initial={{ opacity: 0, y: 40 }}

        whileInView={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.8 }}

        viewport={{ once: true }}

        className="about-card"

      >

          <span className="badge">
             
             <img src="https://img.icons8.com/?size=100&id=yr3MRiBOY9BN&format=png&color=000000" 
             style={{width: '100px'}}
              />

            <h1>Sobre mim</h1>

        </span>

        <h2>

          Olá, eu sou Rayssa Silva

        </h2>

        <p>

          Sou estudante de Ciência da Computação e desenvolvedora em formação.

        </p>

        <p>

          Tenho interesse em desenvolvimento web, UI/UX, banco de dados e cibersegurança.

        </p>

        <p>

          Meu objetivo é construir soluções criativas que unam tecnologia, design e experiência do usuário.

        </p>

      </motion.div>

    </section>

  );
}