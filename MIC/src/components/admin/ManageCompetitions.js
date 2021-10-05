import React from 'react'
import { Auto } from "../styledComps";

//Not functional, just testing things right now

export default function ManageCompetitions() {
  var a ="0";
  var b=undefined;
  var c="0";
  return (
    <div>
      <Auto
        disabled
        title="Crazy"
        text="Select Your Grade Level"
        onChange={(event, newValue) => {console.log(newValue)}}
        width={300}
        value={b}
        error={c}
      />
    </div>
  )
}
