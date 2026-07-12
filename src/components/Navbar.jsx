import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
      className="navbar"
    >
      <div className="logo">
        RS
      </div>

      <div className="menu">

        <a href="#sobre">Sobre</a>

        <a href="#projetos">Projetos</a>

        <a href="#habilidades">Habilidades</a>

        <a href="#contato">Contato</a>

      </div>
    </motion.nav>
  );
}