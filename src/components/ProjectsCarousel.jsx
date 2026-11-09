import { useEffect, useRef, useState } from "react";
import ProjectCard from "./ProjectCard";
import "./ProjectsCarousel.css";

export default function ProjectsCarousel({ projects }) {
  const viewport = useRef(null);
  const track = useRef(null);
  const cycle = useRef(0);
  const interaction = useRef({ hover: false, focus: false, pointer: false, until: 0 });
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = viewport.current;
    let frame;
    let last = 0;
    let position = 0;
    let inView = false;
    const measure = () => {
      const previous = cycle.current;
      const next = track.current.children[1].offsetLeft - track.current.children[0].offsetLeft;
      if (previous && Math.abs(previous - next) < 0.5) { position = element.scrollLeft; return; }
      const progress = previous ? ((element.scrollLeft % previous) + previous) % previous / previous : 0;
      cycle.current = next;
      element.scrollLeft = next * (1 + progress);
      position = element.scrollLeft;
    };
    const normalize = () => {
      const size = cycle.current;
      if (!size || (interaction.current.focus && document.activeElement !== element)) return;
      const before = element.scrollLeft;
      if (element.scrollLeft < size * 0.5) element.scrollLeft += size;
      else if (element.scrollLeft >= size * 1.5) element.scrollLeft -= size;
      if (drag.current) drag.current.start += element.scrollLeft - before;
      if (Math.abs(position - element.scrollLeft) > 1.5 || interaction.current.pointer || interaction.current.focus) position = element.scrollLeft;
    };
    const onScroll = () => {
      normalize();
      if (interaction.current.pointer) interaction.current.until = performance.now() + 1400;
    };
    const tick = (time) => {
      const state = interaction.current;
      const delta = last ? Math.min(time - last, 50) : 0;
      last = time;
      if (inView && !document.hidden && !paused && !reducedMotion && !state.hover && !state.focus && !state.pointer && time > state.until) {
        position += delta * 0.025; // 25 CSS pixels/second, independent of refresh rate.
        const size = cycle.current;
        if (size && position >= size * 1.5) position -= size;
        element.scrollLeft = position;
        // Preserve subpixel progress on browsers that round scrollLeft.
      } else position = element.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
    visibility.observe(element);
    measure();
    element.addEventListener("scroll", onScroll, { passive: true });
    if (!paused && !reducedMotion) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      element.removeEventListener("scroll", onScroll);
    };
  }, [paused, reducedMotion]);

  useEffect(() => {
    const finish = () => {
      drag.current = null;
      interaction.current.pointer = false;
      interaction.current.until = performance.now() + 1400;
    };
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    return () => {
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  }, []);

  const move = (direction) => {
    setPaused(true);
    const step = cycle.current / projects.length;
    viewport.current.scrollLeft += direction * step;
  };

  return (
    <div className="projects-carousel" role="region" aria-roledescription="carrossel" aria-label="Projetos da Rayssa">
      <header className="carousel-toolbar container">
        <div className="carousel-heading">
          <h2 id="projects-title">Meus Projetos</h2>
          <p id="projects-carousel-help">Arraste para explorar os projetos.</p>
        </div>
        <div className="carousel-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Projeto anterior" aria-controls="projects-viewport">←</button>
          <button type="button" onClick={() => setPaused((value) => !value)} disabled={!!reducedMotion} aria-controls="projects-viewport">
            {reducedMotion ? "Movimento reduzido" : paused ? "Retomar movimento" : "Pausar movimento"}
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Próximo projeto" aria-controls="projects-viewport">→</button>
        </div>
      </header>
      <div id="projects-viewport" className="carousel-viewport" ref={viewport} tabIndex={0} aria-describedby="projects-carousel-help"
        onMouseEnter={() => { interaction.current.hover = true; }}
        onMouseLeave={() => { interaction.current.hover = false; }}
        onFocusCapture={() => { interaction.current.focus = true; }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) interaction.current.focus = false; }}
        onKeyDown={(event) => {
          if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          interaction.current.pointer = true;
          suppressClick.current = false;
          drag.current = { x: event.clientX, start: event.currentTarget.scrollLeft, type: event.pointerType, moved: false };
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current || current.type === "touch") return;
          const distance = event.clientX - current.x;
          if (Math.abs(distance) > 6) {
            current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          if (current.moved) {
            event.preventDefault();
            event.currentTarget.scrollLeft = current.start - distance;
            // Keep the drag origin aligned after an invisible loop normalization.
            current.start = event.currentTarget.scrollLeft + distance;
            suppressClick.current = true;
          }
        }}
        onPointerUp={() => { drag.current = null; interaction.current.pointer = false; interaction.current.until = performance.now() + 1400; }}
        onPointerCancel={() => { drag.current = null; interaction.current.pointer = false; interaction.current.until = performance.now() + 1400; }}
        onLostPointerCapture={() => { drag.current = null; interaction.current.pointer = false; }}
        onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="carousel-track" ref={track}>
          {[-1, 0, 1].map((copy) => (
            <div className="carousel-group" key={copy} aria-hidden={copy !== 0 ? true : undefined}>
              {projects.map((project) => <ProjectCard key={project.titulo} {...project} decorativeCopy={copy !== 0} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
