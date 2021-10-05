import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import getPage from "./getPage";
import getWeb from "./getWeb";

export default function Competitions() {
  const title = "competitions";
  const [comp, setComp] = useState(getPage(title, "records"));

  useEffect(() => {
    getWeb(title).then((result) => {
      result !== undefined ? setComp(result.records) : setComp(comp);
    })
  }, [comp])

  const onClick = () => {
  }

  return (
    <div className="Competitions">
      <Button onClick={onClick}>Competitions</Button>
    </div>
  );
}
