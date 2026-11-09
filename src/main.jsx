import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import Lenis from "lenis";

const smoothMotion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
let lenis;
const configureScrolling = () => {
  lenis?.destroy();
  lenis = smoothMotion.matches ? new Lenis({ duration: 1.2, smoothWheel: true, autoRaf: true, prevent: (node) => node.classList?.contains("chatbot-messages") }) : undefined;
};
configureScrolling();
smoothMotion.addEventListener("change", configureScrolling);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <App/>
  </React.StrictMode>
);