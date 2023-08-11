import styled from "@mui/material/styles/styled";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Tooltip, {tooltipClasses} from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircle from "@mui/icons-material/AccountCircle";

import { DataGrid } from "@mui/x-data-grid";

import { Link } from "react-router-dom";

const color = "#3f51b5";
const profCol = "#" + ((Math.random() * 0xffffff) << 0).toString(16);

/**
 * Q&A component for the FAQ page.
 *
 * @param {string} title: The question for the Q&A
 * @param {string} content: HTML text to be displayed as the answer to the question
 */
const Accord = (props) => {
	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMore />} id={props.title}>
				<FAQHead>{props.title}</FAQHead>
			</AccordionSummary>
			<AccordionDetails>
				<span dangerouslySetInnerHTML={{ __html: props.content }}></span>
			</AccordionDetails>
		</Accordion>
	);
};

/**
 * Alert component used to display given alerts.
 *
 * @param {boolean} open: Determines when the alerts are shown or not.
 * @param {function} handleClose: Function that handles the closing event of the alerts component.
 * @param {string} type: The type of alert message.
 * @param {string} message: The message to display when the alert is open.
 */
const Alerts = (props) => {
	return (
		<Snackbar
			open={props.open}
			onClose={props.handleClose}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}>
			<Alert severity={props.type} variant="filled">
				{props.message}
			</Alert>
		</Snackbar>
	);
};

// Nav bar base column style
const All = styled("div")({
	"& .MuiPaper-root": {
		backgroundColor: "transparent",
		color: "white",
	},
	"& .MuiAccordion-root.Mui-expanded": {
		margin: "0px",
	},
	"& .MuiButtonBase-root": {
		display: "flex",
		alignItems: "left",
	},
	"& .MuiPaper-elevation1": {
		boxShadow: "none",
	},
	"& .MuiAccordion-root:before": {
		backgroundColor: "transparent",
	},
	"& .MuiButton-root": {
		fontWeight: "inherit",
	},
});

/**
 * Autocomplete component
 *
 * @param {string} title: Title displayed to the left of the input box.
 * @param {array} options: Possible options to select from.
 * @param {string} text: Label of the input box.
 * @param {function} onChange: Function called when a new option is selected from the auto-complete list.
 * @param {integer} width: Width of the input box in pixels.
 * @param {string} value: Selected value of the input box.
 * @param {boolean} error: Used to display error messages.
 * @param {boolean} disabled: Used to disable selection of options.
 */
const Auto = (props) => {
	return (
		<div style={{ display: "flex" }}>
			<Grid item sm={3}>
				<p>{props.title}</p>
			</Grid>
			<Autocomplete
				options={props.options ? props.options.map((option) => option) : []}
				value={props.value}
				onChange={props.onChange}
				disabled={props.disabled}
				freeSolo
				renderInput={(params) => (
					<TextField
						{...params}
						error={props.error && (props.value === null || props.value === "")}
						helperText={
							props.error && (props.value === null || props.value === "")
								? "Please fill out to continue."
								: null
						}
						label={props.text}
						variant="outlined"
						required
						style={{
							...props.style,
							width: props.width,
							maxWidth: "65vw",
							marginRight: 0,
						}}
					/>
				)}
			/>
		</div>
	);
};

/**
 * Website default page style
 *
 * @param {JSX components} children: The children of the page.
 */
const BasicPage = (props) => {
	return (
		<LayerOne>
			<LayerTwo>
				<LayerThree>{props.children}</LayerThree>
			</LayerTwo>
		</LayerOne>
	);
};

// Style for the Navbar closed state
const ClosedNav = styled("div")({
	transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)",
	background: "#3f51b5",
	display: "flex",
	flexDirection: "row",
	zIndex: "1300",
	"&::-webkit-scrollbar": {
		display: "none",
	},
});

/**
 * Datatable for marking masters
 *
 * @param {*} props: props for the MUI DataGrid component
 */
const DataTable = (props) => {
	return (
		<div style={{ flexGrow: 1, paddingTop: "5px" }}>
			<DataGrid {...props} autoHeight />
		</div>
	);
};

// Default profile button style for a link button
const DefaultProfile = styled(AccountCircle)({
	color: "#c6c6c6",
	width: "40px",
	height: "40px",
	"&:hover": {
		filter: "brightness(0.65)",
		cursor: "pointer",
	},
});

/**
 * Autocomplete component
 *
 * @param {string} title: Title displayed to the left of the input box.
 * @param {array} options: Possible options to select from.
 * @param {string} text: Label of the input box.
 * @param {function} onChange: Function called when a new option is selected from the auto-complete list.
 * @param {integer} width: Width of the input box in pixels.
 * @param {string} value: Selected value of the input box.
 * @param {boolean} error: Used to display error messages.
 * @param {boolean} disabled: Used to disable selection of options.
 * @param {string} helperText: Text that displays under the input box.
 * @param {object} style: Style of the input box.
 * */
const Drop = (props) => {
	return (
		<div style={{ display: "flex" }}>
			<Grid item sm={3}>
				<p>{props.title}</p>
			</Grid>
			<Autocomplete
				options={props.options ? props.options.map((option) => option) : []}
				value={props.value}
				onChange={props.onChange}
				disabled={props.disabled}
				freeSolo
				onClose={props.onInputChange}
				renderInput={(params) => (
					<TextField
						{...params}
						error={props.error}
						helperText={props.helperText}
						label={props.text}
						variant="outlined"
						required
						style={props.style}
					/>
				)}
			/>
		</div>
	);
};

// Title style for FAQ Q&A
const FAQHead = styled(Typography)(({ theme }) => ({
	fontSize: theme.typography.pxToRem(15),
	fontWeight: theme.typography.fontWeightRegular,
}));

// Forgot password form style
const Form = styled("form")(({ theme }) => ({
	width: "100%",
	marginTop: theme.spacing(1),
}));

// Overall style for the navbar
const FullNav = styled("div")({
	position: "sticky",
	top: "-1px",
	zIndex: "5",
});

// Header for nav bar columns
const Header = styled(Typography)({
	display: "flex",
	color: "white",
	justifyContent: "center",
	paddingTop: "5px",
	"@media screen and (min-width: 420px)": {
		fontSize: "15px",
	},
	"@media screen and (max-width: 420px)": {
		fontSize: "3.5vw",
	},
});

const HtmlTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
)) (({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		fontSize: theme.typography.pxToRem(14)
	},
}));

// Image on home
const Image = styled("img")({
	width: "100%",
	borderRadius: "5px",
	marginBottom: "1%",
});

// Image column on home
const ImageSet = styled("div")({
	marginRight: "2%",
	marginTop: "2%",
	marginBottom: "2%",
	width: "20%",
	textAlign: "center",
});

// For default home page's
const LayerOne = styled("div")({
	display: "flex",
	flexDirection: "row",
});

// For default home page's
const LayerThree = styled("div")({
	marginLeft: "1%",
	marginRight: "1%",
	marginBottom: "1%",
});

// For default home page's
const LayerTwo = styled("div")({
	margin: "2%",
	boxShadow:
		"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)",
	width: "100%",
	minHeight: "80vh",
	maxHeight: "100%",
	maxWidth: "100%",
});

/**
 * Button that links to a page
 *
 * @param {string} to: target to link to (e.g., /page/subpage)
 * @param {function} onClick: function telling what action should be performed upon clicking the button
 * @param {object} sx: the style of the button
 * @param {boolean} regBut: used to determine if the button is being used for the navbar profile button
 * @param {boolean} avatar: used to determine if the user has signed in and display the appropriate button
 * @param {string} text: the text the should be displayed on the button
 */
const LinkButton = (props) => {
	return (
		<Linked to={props.to} onClick={props.onClick} style={props.sx}>
			{props.regBut === undefined ? (
				props.avatar === undefined ? (
					<NavButton>{props.text}</NavButton>
				) : (
					<DefaultProfile />
				)
			) : (
				<Button style={{ color: "black" }}>{props.text}</Button>
			)}
		</Linked>
	);
};

// Styled link
const Linked = styled(Link)({
	color: "white",
	border: "currentColor",
	borderRadius: "0",
	textDecoration: "none",
	WebkitTextStroke: "0.25px",
	WebkitTextStrokeColor: "black",
});

// Lock icon for sign in/up
const LockAvatar = styled(Avatar)(({ theme }) => ({
	margin: theme.spacing(1),
	backgroundColor: theme.palette.secondary.main,
}));

// Locations map
const Map = styled("img")({
	marginTop: "2%",
	paddingBottom: "1%",
	maxHeight: "100%",
	maxWidth: "100%",
});

// Layer one of names div stack
const NamesOne = styled("div")({
	width: "100vw",
	minHeight: "80vh",
	display: "flex",
	textAlign: "center",
	justifyContent: "center",
	flexWrap: "wrap",
});

// Layer three of names div stack
const NamesThree = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "100vw",
	borderRadius: "4px",
	marginRight: "2%",
	marginLeft: "2%",
	marginBottom: "1%",
	boxShadow:
		"0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)",
});

// Layer two of names div stack
const NamesTwo = styled("div")({
	display: "flex",
	flexDirection: "row",
	paddingTop: "2%",
	paddingBottom: "2%",
});

// Button used for the nav bar
const NavButton = styled(Button)({
	justifyContent: "left",
	textTransform: "capitalize",
	textDecoration: "none",
	border: "currentColor",
	color: "white",
	borderRadius: "0",
	fontSize: "15px",
	padding: "10px",
	WebkitTextStroke: "0.25px",
	WebkitTextStrokeColor: "black",
	"&:hover": {
		backgroundColor: "#2a3576",
		filter: "brightness(0.9)",
		transition:
			"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
	},
	"@media screen and (min-width: 420px)": {
		fontSize: "15px",
	},
	"@media screen and (max-width: 420px)": {
		fontSize: "3.5vw",
	},
});

// Container style for the open navbar options
const NavOptions = styled("div")({
	background: "url(/assets/img/logo.png) right center/contain no-repeat #3f51b5",
	height: "100%",
	overflowX: "hidden",
	overflowY: "scroll",
	display: "flex",
	padding: "10px",
	backgroundColor: "#3f51b5",
	scrollbarWidth: "none",
	"&::-webkit-scrollbar": {
		display: "none",
	},
});

// 404 page
const NotFound = () => {
	return (
		<div
			style={{
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
			<div
				className="bg"
				style={{
					backgroundImage: "url(http://i.giphy.com/l117HrgEinjIA.gif)",
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					backgroundSize: "cover",
					mixBlendMode: "overlay",
				}}></div>
			<div
				style={{
					fontFamily: "Alfa Slab One",
					fontSize: "25vh",
					fontWeight: "bold",
					color: "white",
					display: "flex",
					backgorundPosition: "center",
					alignItems: "center",
					backgroundSize: "cover",
					justifyContent: "center",
				}}>
				404
			</div>
		</div>
	);
};

/**
 * Default page style for database HTML pages.
 *
 * @param {string} title: Title of the page.
 * @param {string} page: Stringified HTML for the page.
 */
const Page = (props) => {
	return (
		<BasicPage>
			<h1 style={{ fontStyle: "italic" }}>{props.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: props.page }}></div>
		</BasicPage>
	);
};

// Profile root div style
const Paper = styled("div")(({ theme }) => ({
	marginTop: theme.spacing(8),
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
}));

/**
 * Profile page button used for the Navbar
 *
 * @param {string} username: The username of logged in user.
 * @param {function} setOpen: Function used to control the open state of the Navbar; used to close the Navbar.
 */
const Profile = (props) => {
	const username = props.username;

	return (
		<div
			style={{
				marginTop: "10px",
				marginBottom: "10px",
				marginLeft: "auto",
				marginRight: "10px",
			}}>
			{username !== null && username !== undefined ? (
				<ProfileAvatar size="40px">
					<LinkButton
						regBut={true}
						to="/profile"
						onClick={() => {
							props.setOpen(false);
						}}
						text={username
							.match(/(\b\S)?/g)
							.join("")
							.toUpperCase()}
					/>
				</ProfileAvatar>
			) : (
				<LinkButton
					to="/profile"
					onClick={() => {
						props.setOpen(false);
					}}
					avatar={true}
				/>
			)}
		</div>
	);
};

/**
 * Profile icon for profile page
 *
 * @param {integer} size: width and height values
 */
const ProfileAvatar = styled(Avatar, {
	shouldForwardProp: (prop) => prop !== "size",
})(({ size, theme }) => ({
	color: "black",
	backgroundColor: profCol,
	"&:hover": {
		filter: "brightness(0.65)",
		cursor: "pointer",
	},
	margin: theme.spacing(1),
	width: size,
	height: size,
}));

// Submit button style
const Submit = styled(Button)(({ theme }) => ({
	margin: theme.spacing(3, 0, 2),
	background: color,
}));

// Used for the accordion summary in FrontBack
const Summary = styled(AccordionSummary)({
	display: "flex",
	flexDirection: "column",
	textAlign: "center",
	textTransform: "capitalize",
	textDecoration: "none",
	color: "white",
	borderRadius: "0",
	fontSize: "15px",
	padding: "10px",
	WebkitTextStroke: "0.25px",
	WebkitTextStrokeColor: "black",
	"&:hover": {
		backgroundColor: "#2a3576",
		filter: "brightness(0.9)",
		transition:
			"background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
	},
	"@media screen and (min-width: 420px)": {
		fontSize: "15px",
	},
	"@media screen and (max-width: 420px)": {
		fontSize: "3.5vw",
	},
});

// Root component style for the table to enter names
const TableTop = styled("div")({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	padding: "10px",
});

// Table style for a table item in past tests
const Td = styled("td")({
	border: "1px solid black",
	borderCollapse: "collapse",
	paddingLeft: "5px",
});

// Team registration form
const TeamForm = styled("form")(({ theme }) => ({
	"& .MuiTextField-root": {
		margin: theme.spacing(1),
		width: "25ch",
	},
}));

// Table header style for the past tests headers
const Th = styled("th")({
	border: "1px solid black",
	borderCollapse: "collapse",
});

// Navbar closed state title style
const Title = styled(Typography)({
	color: "white",
	display: "flex",
	alignItems: "center",
	fontSize: "2.5rem",
	fontFamily: "math",
});

export {
	Accord,
	Alerts,
	All,
	Auto,
	BasicPage,
	ClosedNav,
	color,
	DataTable,
	Drop,
	Form,
	FullNav,
	Header,
	HtmlTooltip,
	Image,
	ImageSet,
	LayerOne,
	LayerThree,
	LayerTwo,
	LinkButton,
	Linked,
	LockAvatar,
	Map,
	NamesOne,
	NamesThree,
	NamesTwo,
	NavButton,
	NavOptions,
	NotFound,
	Page,
	Paper,
	Profile,
	ProfileAvatar,
	Submit,
	Summary,
	TableTop,
	Td,
	TeamForm,
	Th,
	Title,
};
