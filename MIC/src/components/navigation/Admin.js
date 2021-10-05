import React from "react";
import { Header, LinkButton, All } from "../styledComps";

export default function Admin(props) {
   return(
      <All>
         <Header>
            Admin
         </Header>     
         <LinkButton to="/admin/import-content" onClick={props.onClick} text="Import Content"/>
         <LinkButton to="/admin/add-admin" onClick={props.onClick} text="Add Admin"/>
         <LinkButton to="/admin/mark-masters" onClick={props.onClick} text="Mark Masters"/>
         <LinkButton to="/admin/manage-comps" onClick={props.onClick} text="Manage Competitions"/>
      </All>
   );
}
               
               
               
