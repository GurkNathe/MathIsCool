import React from "react";
import useStyles from "../style";

export default function Page(props) {
  const classes = useStyles();
  return(
    <div className={classes.root}>
      <div className={classes.second}>
        <div className={classes.inner}>
          <h1 style={{fontStyle:"italic"}}>{props.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: props.page}}></div>
        </div>
      </div>
    </div>
  );
}
