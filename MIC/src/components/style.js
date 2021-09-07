import { makeStyles } from "@material-ui/core"

import image from "../assets/logo.5a82c15d88ad2d074447.png";

/**
 * Main styles sheet
*/
const profCol = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
const useStyles = makeStyles((theme) => ({
   //frontback, coachtools
   button:{
      justifyContent:"left",
      textTransform:"capitalize",
      textDecoration:"none",
      background:"transparent",
      border:"currentColor",
      color:"white",
      borderRadius:"0",
      width:"100%",
      fontSize:"15px",
      padding:"10px",
      textAlign:"left",
      '-webkit-text-stroke': "0.25px",
      '-webkit-text-stroke-color': "black",
      '&:hover':{
         backgroundColor:"#2a3576",
         filter:"brightness(0.9)",
         transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }
   },
   //frontback, coachtools
   all:{
      '& .MuiPaper-root':{
         backgroundColor:"transparent",
         color:"white"
      },
      '& .MuiAccordion-root.Mui-expanded':{
         margin:"0px"
      },
      '& .MuiButtonBase-root':{
         display:"flex",
         alignItems:"left"
      },
      '& .MuiPaper-elevation1':{
         boxShadow:"none",
      },
      '& .MuiAccordion-root:before':{
         backgroundColor:"transparent",
      },
      '& .MuiButton-root':{
         fontWeight:"inherit",
      }
   },

   //Default page style
   root: {
      display: "flex", 
      flexDirection:"row"
   },
   second: {
      margin:"2%", 
      boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", 
      width:"100%",
      minHeight:"80vh", 
      maxHeight:"100%", 
      maxWidth:"100%"
   },
   inner: {
      marginLeft:"1%", 
      marginRight:"1%",
      minHeight:"80vh"
   },

   //Home
   imgCol:{
      marginRight:"2%", 
      marginTop:"2%", 
      marginBottom:"2%", 
      width:"20%", 
      textAlign:"center"
   },
   imgSty:{
      width:"100%", 
      borderRadius:"5px", 
      marginBottom:"1%"
   },

   //FAQ
   heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
   },

   //for page title
   header:{
      fontStyle:"italic"
   },

   //locations
   map:{
      marginTop:"2%", 
      paddingBottom:"1%", 
      maxHeight:"100%", 
      maxWidth:"100%"
   },

   //sidebar styles 
   closed:{
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
      background: "#3f51b5",
      display:"flex",
      flexDirection:"row",
      '&::-webkit-scrollbar':{
         display:"none"
      }
   },
   x:{
      color:"white",
      '&:hover':{
         color:"#101010",
         backgroundColor:"transparent",
         transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
      '& .MuiButton-root':{
         fontWeight:"inherit",
      }
   },
   in:{
      background:`url(${image}) right center/contain no-repeat #3f51b5`,
      height:"100%", 
      overflowX:"hidden",
      overflowY:"scroll",
      display:"flex",
      '&::-webkit-scrollbar':{
         display:"none"
      }
   },
   outer:{
      overflow:"hidden",
   },
   avatar: {
      backgroundColor: profCol,
      '&:hover':{
        filter: "brightness(0.65)",
        cursor: "pointer",
      },
      width: "40px",
      height: "40px",
   },
   avatar2: {
      color:"#c6c6c6",
      width: "40px",
      height: "40px",
      '&:hover':{
         filter: "brightness(0.65)",
         cursor: "pointer",
      }
   },
   //sidebar styles

   //home buttons
   homeButton: {
      justifyContent:"left",
      textTransform:"capitalize",
      textDecoration:"none",
      border:"currentColor",
      color:"white",
      borderRadius:"0",
      fontSize:"15px",
      padding:"10px",
      '-webkit-text-stroke': "0.25px",
      '-webkit-text-stroke-color': "black",
      '&:hover':{
         backgroundColor:"#2a3576",
         filter:"brightness(0.9)",
         transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }
   },

   //profile page
   pAvatar: {
      color:"black",
      backgroundColor: profCol,
      '&:hover':{
         filter: "brightness(0.65)",
         cursor: "pointer",
      },
      margin: theme.spacing(1),
      width:"100px",
      height:"100px",
   },
   paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },

   //Name Table
   table:{
      display:"flex", 
      flexDirection: "row", 
      flexWrap: "wrap", 
      justifyContent: "space-between",
      alignItems:"center",
      padding:"10px"
   },
   indiv:{
      display:"flex", 
      flexDirection: "row", 
      flexWrap: "wrap", 
      justifyContent: "space-between",
      alignItems:"center",
      padding:"10px"
   },
   tableTop:{
      display:"flex",
      flexDirection:"column",
   },

   //student
   field:{
      minWidth:"10vw",
      maxWidth:"50vw",
      width:"100%",
   },
   main:{
      width:"100%"
   },

   //Enter Names
   page: {
      width:"100vw",
      minHeight:"80vh",
      display:"flex",
      textAlign:"center",
      justifyContent:"center",
      flexWrap:"wrap",
   },
   innerN: {
      padding:"10px",
   },
   title: {
      fontSize: "1.35rem",
   },
   top: {
      display: "flex", 
      flexDirection:"row",
      paddingTop: "2%",
      paddingBottom: "2%",
   },
   middle: {
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      width:"100vw",
      borderRadius: "4px", 
      marginRight:"2%",
      marginLeft:"2%",
      marginBottom:"1%",
      boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"
   },
   bottom: {
      margin: "1%",
   },

   //Register Form
   gform: {
      width:"100%",
      height:"1379px",
      frameBorder:"0",
      marginHeight:"0",
      marginWidth:"0",
   },

}));

export default useStyles;
