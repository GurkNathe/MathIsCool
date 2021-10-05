import React from "react";
import { LinkButton, Header, All } from "../styledComps";

export default function CoachTools(props){
   return(
      <All>
         <Header>
            Coach Tools
         </Header>
         <LinkButton to="/team-register" onClick={props.onClick} text="Register Team"/>
         <LinkButton to="/enter-names" onClick={props.onClick} text="Enter Names"/>
      </All>
   );
}
