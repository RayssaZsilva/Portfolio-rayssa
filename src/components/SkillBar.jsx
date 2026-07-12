export default function SkillBar({

  nome,

  porcentagem

}) {

  return (

    <div className="skill-item">

      <div className="skill-header">

        <span>{nome}</span>

        <span>{porcentagem}%</span>

      </div>

      <div className="skill-track">

        <div

          className="skill-progress"

          style={{

            width: `${porcentagem}%`

          }}

        />

      </div>

    </div>

  );
}