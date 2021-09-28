import React from 'react'

//Might change, leaving it in as a placeholder

export default function NotFound() {

  const back = { image: 'http://i.giphy.com/l117HrgEinjIA.gif' };

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#121212",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
        <div className="bg" style={{ 
          backgroundImage: 'url(http://i.giphy.com/l117HrgEinjIA.gif)', 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          mixBlendMode: "overlay",
          }}></div>
        <div style={{
          fontFamily: 'Alfa Slab One',
          fontSize: "25vh",
          fontWeight: "bold",
          color: "white",
          display: "flex",
          backgorundPosition: "center",
          alignItems: "center",
          backgroundSize: "cover",
          justifyContent: "center",
        }}>404</div>
    </div>
  )
}
