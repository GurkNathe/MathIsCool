import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from "react";
import useStyles from "../style";

//Used for FAQ items
/**
 * @param  {string} title
 * @param  {string} content
 * @param  {integer} key
 */
export default function Accord(props){
  const classes = useStyles();

  return(
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={props.title}
      >
        <Typography className={classes.heading}>
          {props.title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {props.content}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}