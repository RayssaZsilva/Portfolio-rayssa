import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", id: "home" },
  { name: "Sobre", id: "sobre" },
  { name: "Tecnologias", id: "habilidades" },
  { name: "projetos", id: "projetos" },
  { name: "Contato", id: "contato" },
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

  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const closeOnResize = () => setOpen(false);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    window.addEventListener("resize", closeOnResize);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [open]);

  function goTo(id) {
    setOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }

  return (
    <header ref={headerRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} className={`navbar ${scroll ? "navbar-scroll" : ""}`}>
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
          id="primary-navigation"
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
          ref={toggleRef}
          aria-controls="primary-navigation"
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