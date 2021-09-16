import React, { useState } from 'react';
import BasicPage from '../custom/BasicPage';
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
    </BasicPage>
  );

}
