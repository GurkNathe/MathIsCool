import React, { useState, useEffect } from 'react'
import BasicPage from '../custom/BasicPage';
import ReactLoading from 'react-loading';
import MastersTeams from '../custom/MastersTeams';
import fire from "../fire";
import { useHistory } from 'react-router';

//gets every compeition currently available
//TODO: tweak this to know which compeitions to not get
async function getComps(){
  try{
    //getting all competitions
    const comps = await fire.firestore().collection("competitions").get();

    //creating an Array version of the competions
    var competitions = [];
    comps.forEach((doc) => {
      competitions.push(doc.data())
    })

    //prevents the need for multiple reads in one session
    sessionStorage.setItem("mastersComps", JSON.stringify(competitions)); 

    return(competitions)
  } catch(error) {
    return error;
  }
}

export default function MarkMasters() {
  const history = useHistory();
  const [comps, setComps] = useState({comp: JSON.parse(sessionStorage.getItem("mastersComps")), loading: true});

  if(comps.comp === null || comps.comp === undefined){
    getComps().then((result) => {
      console.log(result)
      setComps((prev) => ({
        ...prev,
        comp: result,
        loading: false
      }));
    })
  } else if(comps.loading) {
    setComps((prev) => ({
      ...prev,
      loading: false,
    }))
  }

  const onClick = (data) => {
    history.push({
      pathname: '/admin/mark-masters/teams',
      state: {
        data: data,
      }
    })
  }

  return (
    <BasicPage>
      {!comps.loading ? 
        <table>
          <thead>
            <th>Site</th>
            <th>Level</th>
            <th>Date</th>
            <th>Status</th>
            <th></th>
          </thead>
          {Object.values(comps.comp).map((data, index) => {
            return(
              <tbody key={index}>
                <td>
                  {data.site.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))}
                </td>
                <td>
                  {data.grade}
                </td>
                <td>
                  {data.compDate}
                </td>
                <td>
                  {data.status}
                </td>
                <td>
                  <a href="/admin/mark-masters/teams" onClick={() => onClick(data)}>View Teams</a>
                </td>
              </tbody>
            )
          })}
        </table> :
        <div style={{position:"fixed", top:"45%", left:"45%"}}>
          <ReactLoading type="spinningBubbles" color="#000" style={{width:"50px", height:"50px"}}/>
        </div>
      }
    </BasicPage>
  )
}
