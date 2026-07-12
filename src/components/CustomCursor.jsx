import {

  useEffect,

  useState

} from "react";

export default function CustomCursor() {

  const [

    position,

    setPosition

  ] = useState({

    x: 0,

    y: 0

  });

  useEffect(() => {

    const mover = (e) => {

      setPosition({

        x: e.clientX,

        y: e.clientY

      });

    };

    window.addEventListener(

      "mousemove",

      mover

    );

    return () =>

      window.removeEventListener(

        "mousemove",

        mover

      );

  }, []);

  return (

    <div

      className="cursor"

      style={{

        left: position.x,

        top: position.y,

      }}

    />

  );

}