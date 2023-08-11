import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import { Container, Typography } from "@mui/material";

import { Paper, Submit } from "../styledComps";

export default function BadSubmit() {
    let history = useHistory();

    const sendEmail = () => {
        const name = history.location.state.name;
        const school = history.location.state.school; 

        const link = "mailto:ethan.c.krug@gmail.com"
            + "?cc=mathcoachcms@gmail.com"
            + "&subject=" + encodeURIComponent("Request To Add School")
            + "&body=" + encodeURIComponent(`${name} has requested ${school} be added as a valid option.`);

        window.location.href = link;
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper>
                <Typography variant="h6">
					The school you have entered is not known to the Academics Are Cool system.
                    If you would like to have your school added, please click the button below to email
                    the Website Administrator.
				</Typography>
                <Submit variant="contained" onClick={sendEmail}>
                    Send Email
                </Submit>
            </Paper>
        </Container>
    );
}