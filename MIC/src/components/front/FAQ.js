import React from 'react';
import Accord from "../custom/Accord";
import useStyles from '../style';

export default function FAQ() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.second}>
        <div className={classes.inner}>
          <Accord
            title="test"
            content="test2"
          />
        </div>
      </div>
    </div>
  );
}