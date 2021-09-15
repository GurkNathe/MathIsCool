import React from 'react'
import BasicPage from './BasicPage';
import options from '../back/options.json';
import { Button, Grid, Typography } from '@material-ui/core';

export default function MastersTeams(props) {
  const level = options.level;
  const schools = options.school;
  const data = props.location.state ? props.location.state.data : null;
  
  //get display form of grades (i.e. instead of 1 get 11-12 or for 9 get 9-10)
  var grades = []
  for(const item in level){
    for(const char in data.grade.substr(1)){
       if(level[item].value === data.grade.substr(1)[char]){
          grades.push(level[item].label)
          break;
       }
    }
  }

  var grade = grades.length > 2 ? grades.join(", ") : grades.join(" and ");
  grade = grades.length > 2 ? grade.substring(0, grade.lastIndexOf(", ")) + ", and " + grade.substring(grade.lastIndexOf(", ")+2, grade.length) : grade;

  const getSchoolName = (reg) => {
    let schoolName = "";
    for(const option in schools){
      if(schools[option].value === reg.schoolID){
          schoolName = schools[option].label
          break;
      }
    }
    return schoolName;
  }

  //TODO: convert to DataGrid from material-ui
  return (
    <BasicPage>
      {Object.keys(data.registration).length > 0 ? 
        <>
          <p>
            Competition at&nbsp;
            {data.site.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))} for&nbsp;
            {grade} on&nbsp;
            {data.compDate}
          </p>
          <table>
            <thead>
              <th>School</th>
              <th>Status</th>
            </thead>
            <tbody>
              {Object.values(data.registration).map((reg, index) => {
                return(
                  <>
                    <td key={index}>
                      {getSchoolName(reg)}
                    </td>
                    <td>
                      yes
                    </td>
                  </>
                )
              })}
            </tbody>
          </table>
          <Grid container>
            <Grid item sm={3} width="100px">
              <Button
                  fullWidth
                  variant="contained"
                  color="primary"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </> :
        <div style={{display:"flex", height:"80vh", alignItems:"center", justifyContent:"center",}}>
          <Typography style={{opacity:"50%"}}>
            You have no registrations.
          </Typography>
        </div>
      }
    </BasicPage>
  )
}
