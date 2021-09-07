import React from "react";

import fire from "../fire";

export default function AddAdmin(){
  const onClick = () => {
    const email = document.querySelector("#email").value;
    console.log(email)
  }

  return(
    <div>
      <input id="email"/>
      <button onClick={onClick}>
        Press me
      </button>
    </div>
  );
}