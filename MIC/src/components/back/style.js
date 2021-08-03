import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
   button:{
      justifyContent:"left",
      textTransform:"capitalize",
      textDecoration:"none",
      background:"transparent",
      border:"currentColor",
      color:"white",
      width:"auto",
      borderRadius:"0",
      width:"100%",
      fontSize:"15px",
      padding:"10px",
      textAlign:"left",
      '-webkit-text-stroke': "0.25px",
      '-webkit-text-stroke-color': "black",
      '&:hover':{
         backgroundColor:"#2a3576",
         opacity:"0.9",
         transition:"background-color 250ms \
                     cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow \
                     250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border \
                     250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }
   },
   all:{
      '& .MuiPaper-root':{
         backgroundColor:"transparent",
         color:"white"
      },
      '& .MuiAccordionSummary-root':{
         color:"white",
         background:"transparent",
         fontSize:"15px",
         '-webkit-text-stroke': "0.25px",
         '-webkit-text-stroke-color': "black",
         '&:hover':{
            backgroundColor:"#2a3576",
            opacity:"0.9",
            transition:"background-color 250ms \
                        cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow \
                        250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border \
                        250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
         }
      },
      '& .MuiAccordion-root.Mui-expanded':{
         margin:"0px"
      },
      '& .MuiButtonBase-root':{
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
   }
}));

export default useStyles;
