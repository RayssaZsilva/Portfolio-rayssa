import "./index.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Socials from "./components/Socials";
import Footer from "./components/Footer";

import Background from "./components/Background";
import CustomCursor from "./components/CustomCursor";

function App() {
  return (
    <div className="app">
      <Background />
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Socials />
      </main>

      <Footer />
    </div>
  );
}

export default App;