export default function Socials() {
  return (
    <section id="contato" className="socials container">
      <h2>Vamos nos conectar</h2>

      <div className="social-grid">
        <a href="https://github.com/RayssaZsilva" target="_blank" rel="noreferrer">
        <img 
          src="https://img.icons8.com/?size=100&id=52539&format=png&color=000000"
          style={{ width: '50px' }}
          />
          <span>GitHub</span>
        </a>

        <a href="https://www.linkedin.com/in/rayssa-silva-034665208?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer">
          <img 
          src="https://img.icons8.com/?size=100&id=IXUU4h36YfmO&format=png&color=000000"
          style={{width: '50px'}}
          />
          <span>LinkedIn</span>
        </a>

        <a href="https://www.instagram.com/rayssas.cs?igsh=OXh0ZWs2ZmJucmc1&utm_source=qr" target="_blank" rel="noreferrer">
          <img 
          src="https://img.icons8.com/?size=100&id=43625&format=png&color=000000"
          style={{width: '50px'}}
          />
          <span>Instagram</span>
        </a>
        
        <a href="https://wa.me/5511942862162" target="_blank" rel="noreferrer">
          <img 
            src="https://img.icons8.com/?size=100&id=43677&format=png&color=000000" 
            alt="WhatsApp" 
            style={{ width: '50px' }} 
        />
          <span>WhatsApp</span>
        </a>

      </div>
    </section>
  );
}
