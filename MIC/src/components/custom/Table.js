import React from "react";

export default function Table(props) {
  return(
    <div style={{display:"flex", flexDirection:"row"}}>
      {props.nums.map((num) => {
        return(
          <div>
            {num}
          </div>
        );
      })}
    </div>
  );
}
