import React from "react";

function History() {
  return (
    <div style={{display: "flex", flexDirection:"row", position:"absolute", top:"134px", bottom:"0", zIndex: -1}}>
      <div style={{margin:"2%", boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"}}>
        <div style={{marginLeft:"1%", marginRight:"1%"}}>
          <h1 style={{fontStyle:"italic"}}>History</h1>
          <p>
            "Academics Are Cool" began in the spring of 1996 when Gregg 
            Sampson, a mathematics teacher at Lewis & Clark High School 
            (LCHS) in Spokane, Washington organized a mathematics 
            competition for sixth grade students in the Spokane area. 
            He and members of the LCHS Math Team organized the events, 
            wrote the competition items and implemented the competition 
            at LCHS.
          </p>
          <ul>
            <li>
              The following school year (1996/1997), the competition was 
              expanded to grades 4-12 with grade level competitions held 
              on six dates throughout the school year at LCHS. During the 
              same school year, Triscia Hochstatter, a mathematics teacher 
              at Moses Lake High School (MLHS), organized a grade four and 
              five combined "Math Is Cool" competition in Moses Lake, adding 
              more grade levels in subsequent years.
            </li>
            <li>
              Beginning with the 1998/1999 school year, "Math Is Cool" 
              competitions were held in Seattle, conducted by Gregg Sampson 
              and Sean Ahern, a University of Washington student and LCHS 
              alumnus. In 2002, Tom Tosch took over as the Seattle Regional 
              Director.
            </li>
            <li>
              Starting with the 2005/2006 school year, Wenatchee began hosting 
              4-6th grade competitions.
            </li>
            <li>
              In the 2008/2009 school year, the Vancouver region began hosting 
              4th-12th grade competitions.
            </li>
            <li>
              The next year (2010/2011), Tri-Cities began hosting 4-6th grades.
            </li>
            <li>
              In 2015-2016, Coeur d’Alene began hosting 4th and 5th grades, 
              adding 6th grade the next year.
            </li>
            <li>
              In the 2017-2018 school year, the 7/8 Championships contest was 
              held on the same date as the 6th grade Championships contest and 
              both Tri-Cities and Wenatchee added the 7/8 contest.
            </li>
            <li>
              In the year 2000-2001, the approximate number of students that 
              competed was 3686. By the 2016-2017 school year, that number had 
              grown to over 8000.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default History;

