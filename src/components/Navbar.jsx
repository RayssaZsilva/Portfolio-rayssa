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

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function goTo(id) {
    setOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  }

  return (
    <header className={scroll ? "navbar navbar-scroll" : "navbar"}>
      <div className="container navbar-content">

        <div className="logo">
          <span>R</span>
          <h2>Rayssa</h2>
        </div>

        <nav className={open ? "menu active" : "menu"}>
          {links.map((item) => (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <button
          className="mobile-button"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26}/> : <Menu size={26}/>}
        </button>

      </div>
    </header>
  );
}