import React from 'react'
import { Button, Grid, Typography } from '@material-ui/core';
import { Redirect } from "react-router-dom";

import BasicPage from './BasicPage';
import options from '../back/options.json';
import DataTable from "../custom/DataTable";
import fire from "../fire";

//adds schools to masters
async function setMasters(master, values){
  var newMasters = [];
  console.log(values)
  for(const i in values){
    if(values[i].status === "Masters Team")
      newMasters.push({grades: values[i].level, schoolID: values[i].schoolId})
  }

  console.log([...master, ...newMasters])
  const data = {teams: [...master, ...newMasters]};
  console.log(data)
  // const mast = fire.firestore().collection("masters").doc("teams").set(data);
  // return(mast);
}

export default function MastersTeams(props) {

  if(!props.location.state){
    return(
      <Redirect to="/admin/mark-masters"/>
    )
  }

  const level = options.level;
  const schools = options.school;
  const data = props.location.state ? props.location.state.data : null;
  const masters = props.location.state ? props.location.state.masters ? props.location.state.masters.teams : null : null;
  
  //gets the stringified version of the current competition's grade(s)
  const getGrade = () => {
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

    //Stringify grades into a legible format
    var grade = grades.length > 2 ? grades.join(", ") : grades.join(" and ");
    grade = grades.length > 2 ? grade.substring(0, grade.lastIndexOf(", ")) + ", and " + grade.substring(grade.lastIndexOf(", ")+2, grade.length) : grade;
    return grade;
  }
 
  const grade = getGrade();

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

  //? should I change <select> to React component or leave as is
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      description:"ID",
      flex: 1,
      hide: true,
      editable: false
    },
    { 
      field: 'schoolId', 
      headerName: 'School ID', 
      description:"School ID",
      flex: 1,
      hide: true,
      editable: false
    },
    { 
      field: 'school', 
      headerName: 'School', 
      description:"School",
      flex: 1,
      editable: false
    },
    { 
      field: 'level', 
      headerName: 'Level', 
      description:"Grade Level",
      flex: 1,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      description:"Status",
      flex: 1,
      editable: false
    },
    {
      field: 'status',
      headerName: 'Status',
      description:"Status",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <select id={params.row.id} onChange={(event) => {params.row.status = event.target.value}}>
          <option value="Team">Team</option>
          <option value="Masters Team">Masters Team</option>
        </select>
      )
    },
  ];
  var rows = [];

  const same = (list, value) => {
    for(const i in list){
      if(list[i].schoolID === value.schoolID)
        return true;
    }
    return false;
  }

  const onSubmit = () => {
    setMasters(masters, rows)
  }

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

          {Object.values(data.registration).map((reg, index) => {
            rows.push({
              id: index,
              schoolId: reg.schoolID,
              school: getSchoolName(reg),
              level: reg.level,
              status: same(masters, reg) ? "Masters Team" : "Team"
            })
          })}

          <DataTable
            pagination
            columns={columns}
            rows={rows}
          />

          <Grid container style={{paddingTop:5, paddingBottom:5}}>
            <Grid item sm={3} width="100px">
              <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </> :
        <div style={{display:"flex", height:"80vh", alignItems:"center", justifyContent:"center",}}>
          <Typography style={{opacity:"50%"}}>
            There are no teams signed up for this compeition.
          </Typography>
        </div>
      }
    </BasicPage>
  )
}
