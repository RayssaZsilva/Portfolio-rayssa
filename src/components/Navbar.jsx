import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Início", id: "home" },
  { name: "Sobre", id: "about" },
  { name: "Tecnologias", id: "skills" },
  { name: "Projetos", id: "projects" },
  { name: "Contato", id: "contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function goTo(id) {
    setOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <header className={`navbar ${scroll ? "navbar-scroll" : ""}`}>
      <div className="container navbar-content">
        <button
          className="logo"
          type="button"
          onClick={() => goTo("home")}
          aria-label="Voltar ao início"
        >
          <span>R</span>
          <h2>Rayssa</h2>
        </button>

        <nav
          className={`menu ${open ? "active" : ""}`}
          aria-label="Navegação principal"
        >
          {links.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <button
          className="mobile-button"
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>
  );
}