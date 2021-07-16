import React from "react";

function Page(props) {
  return(
    <div style={{display: "flex", flexDirection:"row"}}>
      <div style={{margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
        <div style={{marginLeft:"1%", marginRight:"1%"}}>
          <h1 style={{fontStyle:"italic"}}>{props.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: props.page}}></div>
        </div>
      </div>
    </div>
  );
}

export default Page;