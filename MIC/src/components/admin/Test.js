import React, { useState } from 'react';
import { Accord, BasicPage } from "../styledComps";
import Select from "react-select"

export default function FlexLayoutGrid() {
  const [state, setState] = useState("team")

  const options = [
    {value: "team", label: "Team"},
    {value: "masters team", label: "Masters Team"}
  ]

  return (
    <BasicPage>
      <Select
        defaultValue={state}
        options={options}
        onChange={(event) => {setState(event.value)}}
      />
      <Accord key={1} title="Test" content="Testing this"/>
    </BasicPage>
  );

}
