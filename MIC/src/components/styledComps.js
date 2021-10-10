import { styled } from "@mui/material/styles";
import {
  Button,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Autocomplete
} from "@mui/material";
import { ExpandMore, AccountCircle } from '@mui/icons-material';
import { Link } from "react-router-dom";
import image from "../assets/logo.5a82c15d88ad2d074447.png";
import options from "./back/options.json";

const color = "#3f51b5";
const profCol = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

// nav bar base column style
const All = styled("div")({
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
})

// team registration form
const TeamForm = styled("form")(({ theme }) => ({
  '& .MuiTextField-root': {
    margin: theme.spacing(1),
    width: '25ch',
  },
}))

// for default home page's
const LayerOne = styled("div")({
  display: "flex", 
  flexDirection:"row"
})

// for default home page's
const LayerTwo = styled("div")({
  margin:"2%", 
  boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)", 
  width:"100%",
  minHeight:"80vh", 
  maxHeight:"100%", 
  maxWidth:"100%"
})

// for default home page's
const LayerThree = styled("div")({
  marginLeft:"1%", 
  marginRight: "1%",
  marginBottom:"1%",
  minHeight:"80vh"
})

// image column on home
const ImageSet = styled("div")({
  marginRight:"2%", 
  marginTop:"2%", 
  marginBottom:"2%", 
  width:"20%", 
  textAlign:"center"
})

// image on home
const Image = styled("img")({
  width:"100%", 
  borderRadius:"5px", 
  marginBottom:"1%"
})

// locations map
const Map = styled("img")({
  marginTop:"2%", 
  paddingBottom:"1%", 
  maxHeight:"100%", 
  maxWidth:"100%"
})

// profile root div style
const Paper = styled("div")(({theme}) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}))

// forgot password form style
const Form = styled("form")(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}))

// submit button style
const Submit = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  background: color,
}))

// profile icon for profile page
const ProfileAvatar = styled(Avatar, { shouldForwardProp: (prop) => prop !== "size" })(({ size, theme }) => ({
  color:"black",
  backgroundColor: profCol,
  '&:hover':{
      filter: "brightness(0.65)",
      cursor: "pointer",
  },
  margin: theme.spacing(1),
  width:size,
  height:size,
}))

// lock icon for sign in/up
const LockAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}))

// header for nav bar columns
const Header = styled(Typography)({
  display:"flex", 
  color:"white", 
  justifyContent:"center", 
  paddingTop:"5px",
  '@media screen and (min-width: 420px)': {
     fontSize:"15px"
  },
  '@media screen and (max-width: 420px)': {
     fontSize:"3.5vw"
  }
});

// styled link
const Linked = styled(Link)({
  color: "white",
  border:"currentColor",
  borderRadius:"0",
  textDecoration: "none",
  'WebkitTextStroke': "0.25px",
  'WebkitTextStrokeColor': "black",
})

// button used for the nav bar
const NavButton = styled(Button)({
  justifyContent:"left",
  textTransform:"capitalize",
  textDecoration:"none",
  border:"currentColor",
  color:"white",
  borderRadius:"0",
  fontSize:"15px",
  padding:"10px",
  'WebkitTextStroke': "0.25px",
  'WebkitTextStrokeColor': "black",
  '&:hover':{
      backgroundColor:"#2a3576",
      filter:"brightness(0.9)",
      transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  '@media screen and (min-width: 420px)': {
      fontSize:"15px"
  },
  '@media screen and (max-width: 420px)': {
      fontSize:"3.5vw"
  }
})

// used for the accordion summary in FrontBack
const Summary = styled(AccordionSummary)({
  justifyContent:"left",
  textTransform:"capitalize",
  textDecoration:"none",
  border:"currentColor",
  color:"white",
  borderRadius:"0",
  fontSize:"15px",
  padding:"10px",
  'WebkitTextStroke': "0.25px",
  'WebkitTextStrokeColor': "black",
  '&:hover':{
      backgroundColor:"#2a3576",
      filter:"brightness(0.9)",
      transition:"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  '@media screen and (min-width: 420px)': {
      fontSize:"15px"
  },
  '@media screen and (max-width: 420px)': {
      fontSize:"3.5vw"
  }
})

// layer one of names div stack
const NamesOne = styled("div")({
  width:"100vw",
  minHeight:"80vh",
  display:"flex",
  textAlign:"center",
  justifyContent:"center",
  flexWrap:"wrap",
})

// layer two of names div stack
const NamesTwo = styled("div")({
  display: "flex", 
  flexDirection:"row",
  paddingTop: "2%",
  paddingBottom: "2%",
})

// layer three of names div stack
const NamesThree = styled("div")({
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  width:"100vw",
  borderRadius: "4px", 
  marginRight:"2%",
  marginLeft:"2%",
  marginBottom:"1%",
  boxShadow:"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)"
})

const FAQHead = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
  fontWeight: theme.typography.fontWeightRegular,
}))

const Frame = styled("iframe")({
  width:"100%",
  height:"100vh",
  frameBorder:"0",
  marginHeight:"0",
  marginWidth: "0",
})

const DefaultProfile = styled(AccountCircle)({
  color:"#c6c6c6",
  width: "40px",
  height: "40px",
  '&:hover':{
      filter: "brightness(0.65)",
      cursor: "pointer",
  }
})

const ClosedNav = styled("div")({
  transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
  background: "#3f51b5",
  display:"flex",
  flexDirection:"row",
  zIndex:"1300",
  '&::-webkit-scrollbar':{
      display:"none"
  }
})

const FullNav = styled("div")({
  position:"-webkit-sticky",
  position:"sticky",
  top: "-1px",
  zIndex: "5",
})

const Title = styled(Typography)({
  color: "white",
  display: "flex",
  alignItems: "center",
  fontSize: "2.5rem",
  fontFamily: "math"
})

const NavOptions = styled("div")({
  background:`url(${image}) right center/contain no-repeat #3f51b5`,
  height:"100%", 
  overflowX:"hidden",
  overflowY:"scroll",
  display:"flex",
  padding:"10px",
  backgroundColor:"#3f51b5",
  '&::-webkit-scrollbar':{
      display:"none"
  }
})

const TableTop = styled("div")({
  display:"flex",
  flexDirection:"column",
})

const TableDiv = styled("div")({
  display:"flex", 
  flexDirection: "row", 
  flexWrap: "wrap", 
  justifyContent: "space-between",
  alignItems:"center",
  padding:"10px"
})

// Button that links to a page
const LinkButton = (props) => {
  return (
    <Linked to={props.to} onClick={props.onClick}>
      {props.regBut === undefined ?
        props.avatar === undefined ?
          <NavButton>
            {props.text}
          </NavButton> :
          <DefaultProfile/>
          :
        <Button style={{color:"black"}}>
          {props.text}
        </Button>
      }
     </Linked>
  )
}

const Accord = (props) => {
  return(
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore/>}
        id={props.title}
      >
        <FAQHead>
          {props.title}
        </FAQHead>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {props.content}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

/**
 * @param props title, options, text, onChange, width, value, error
 */
 const Auto = (props) => {
  return(
    <div style={{display:"flex"}}>
       <Grid item sm={3}>
          <p>{props.title}</p>
       </Grid>
       <Autocomplete
          options={props.options ? props.options.map((option) => option) : []}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          freeSolo
          renderInput={(params) => 
                         <TextField 
                            {...params}
                            error={props.error && (props.value === null || props.value === "")}
                            helperText={props.error && (props.value === null || props.value === "") ? 
                                           "Please fill out to continue" : 
                                           null
                                        }
                            label={props.text} 
                            variant="outlined"
                            required
                            style={{ ...props.style, width: props.width, maxWidth: "65vw", marginRight: 0 }}
                         />
                      }
       />
    </div>
 );
}

// website default page style
const BasicPage = (props) => {
  return(
    <LayerOne>
      <LayerTwo>
        <LayerThree>
          { props.children }
        </LayerThree>
      </LayerTwo>
    </LayerOne>
  );
}

// homepage default page style
const Page = (props) => {
  return (
    <BasicPage>
      <h1 style={{fontStyle:"italic"}}>{props.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: props.page}}></div>
    </BasicPage>
  )
}

// team registration google form
const GoogleForm = (props) => {
  return(
    <Frame 
      id="frame"
      title="register"
      src={props.location.state.key}
    >
      Loading…
    </Frame>
  );
}

// 404 page
const NotFound = () => {

  const back = { image: 'http://i.giphy.com/l117HrgEinjIA.gif' };

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#121212",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
        <div className="bg" style={{ 
          backgroundImage: 'url(http://i.giphy.com/l117HrgEinjIA.gif)', 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          mixBlendMode: "overlay",
          }}></div>
        <div style={{
          fontFamily: 'Alfa Slab One',
          fontSize: "25vh",
          fontWeight: "bold",
          color: "white",
          display: "flex",
          backgorundPosition: "center",
          alignItems: "center",
          backgroundSize: "cover",
          justifyContent: "center",
        }}>404</div>
    </div>
  )
}

const Profile = (props) => {

  const username = sessionStorage.getItem("username");
  
  return(
    <div style={{marginTop:"10px", marginBottom:"10px", marginLeft:"auto", marginRight:"10px"}}>
      { username !== null && username !== undefined ?
        <ProfileAvatar size="40px">
          <LinkButton
            regBut={true}
            to="/profile"
            onClick={() => { props.setOpen(false) }}
            text={username.match(/(\b\S)?/g).join("").toUpperCase()}
            />
        </ProfileAvatar>
        :
        <LinkButton to="/profile" onClick={() => {props.setOpen(false)}} avatar={true}/>
      }
    </div>
  );
}

const Student = (props) => {
  const field = {
    minWidth:"10vw",
    maxWidth:"50vw",
    width:"100%",
  }

  return(
    <tr style={{width: "100%"}}>
      <td>
        <TextField 
          value={props.stud.name}
          onChange={(event) => props.onChange(event.target.value, props.index, "name")}
          variant="outlined"
        >
        </TextField>
      </td>
      <td>
        <Auto
          options={options.grade}
          value={props.stud.grade}
          style={field}
          onChange={(event, newValue) => props.onChange(newValue, props.index, "grade")}
        />
      </td>
      <td>
        <Auto
          options={options.stlev}
          value={props.stud.level}
          style={field}
          onChange={(event, newValue) => props.onChange(newValue, props.index, "level")}
        />
      </td>
      <td>
        <Auto
          options={props.ops}
          value={props.stud.pos}
          style={field}
          onChange={(event, newValue) => props.onChange(newValue, props.index, "pos")}
        />
      </td>
    </tr>
  );
}

export {
  All, TeamForm, LayerOne, LayerTwo, LayerThree, ImageSet, Image,
  Map, Paper, Form, Submit, ProfileAvatar, LockAvatar, Header,
  Linked, NavButton, Summary, NamesOne, NamesTwo, NamesThree,
  FAQHead, Frame, ClosedNav, FullNav, Title, NavOptions, TableDiv, TableTop,
  LinkButton, Accord, Auto, BasicPage, Page, GoogleForm, NotFound, Profile, Student
}