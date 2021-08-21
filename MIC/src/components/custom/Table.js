import React, { useState } from "react";

import { TextField } from "@material-ui/core";

//props #individuals, #teams
export default function Table(props) {

  const [students, setStudents] = useState({
                                              student1: "",
                                              student2: "",
                                              student3: "",
                                              student4: "",
                                              alt1: "",
                                              alt2: "",
                                            });
  const stud = [1,2,3,4];
  const alts = [1,2]
  const teams = Array.from({length: props.teams}, (_, i) => i + 1);

  return(
    <div style={{display:"flex", flexDirection:"row"}}>
      <div style={{display:"flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between"}}>
        {
          teams.map((team, index) => {
            return(
              <div style={{display:"flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly"}} key={index}>
              {team}
                {
                  stud.map((num, ind) => {
                    return(
                      <div key={ind}>
                        <TextField
                          variant="outlined" 
                          margin="normal"
                          label={`Student #${num}`}
                          value={students[`student${num}`]}
                        />
                    </div>
                    );
                  })
                }
              </div>
            )
          })
        }
      </div>
      {alts.map((num, index) => {
        return(
          <div key={index}>
            <TextField
              variant="outlined" 
              margin="normal"
              label={`Alternate #${num}`}
              value={students[`student${num}`]}
            />
        </div>
        );
      })}
    </div>
  );
}
