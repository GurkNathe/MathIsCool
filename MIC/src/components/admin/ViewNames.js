import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { utils, writeFileXLSX } from "xlsx";

import { BasicPage } from "../styledComps";

export default function ViewNames() {
    const history = useHistory();

    const [data, setData] = useState([]);

    const [options] = useState(JSON.parse(sessionStorage.getItem("options")));

    	// columns for the table
	const columns = [
		{
			field: "id",
			headerName: "ID",
			description: "ID",
			flex: 1,
			hide: true,
			editable: false,
		},
		{
			field: "name",
			headerName: "Name",
			description: "Name",
			flex: 1,
			editable: false,
		},
		{
			field: "level",
			headerName: "Level",
			description: "Level",
			flex: 1,
			editable: false,
		},
		{
			field: "school",
			headerName: "School",
			description: "School",
			flex: 1,
			editable: false,
		},
		{
			field: "teamnum",
			headerName: "Team Number",
			description: "Team Number",
			flex: 1,
			editable: false,
		},
		{
			field: "pos",
			headerName: "Position",
			description: "Position",
			flex: 1,
			editable: false,
		},
	];

    useEffect(() => {
        let newData = [];
        let state = history.location.state.reg;
        let id = 0;

        for (let reg of Object.values(state)) {
            let school = options.school.find(obj => obj.value === reg.schoolID)?.label;

            // If they've started to fill/filled out the names, parse the data
            if (reg.names) {
                for (let student of Object.values(reg.names)) {
                    newData.push(
                        {
                            id: id,
                            name: student.name.length > 0 ? student.name : "unknown",
                            level: student.level.length > 0 ? student.level: "",
                            school: school,
                            pos: student.pos.length > 0 ? student.pos : ""
                        }
                    );
                    id++;
                }
            // If they haven't entered any names, create dummy values
            } else {
                for (let i = 0; i < (reg.numTeams * 4 + 2 + reg.numIndividuals); i++) {
                    newData.push(
                        {
                            id: id,
                            name: "unknown",
                            level: "",
                            school: school,
                            pos: "",
                        }
                    );
                    id++;
                }
            }
        }
        setData(newData);
    },[history.location.state, options.level, options.school])

    /**
	 * Get JSON data and export as Excell file
	 *
	 * @param {JSON object} file : JSON object to conver to an XLSX file
	 */
	const downloadFile = (file) => {
		const sheet = utils.json_to_sheet(file);
		const book = utils.book_new();
		utils.book_append_sheet(book, sheet, "Data");
		writeFileXLSX(book, `names-${history.location.state.name}.xlsx`);
	};

    return (
        <BasicPage>
            <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={() => downloadFile(data)}
                sx={{
                    margin: "10px"
                }}>
                Download Names
            </Button>
            <DataGrid
                autoHeight
                hideFooter
                columns={columns}
                rows={data}
            />
        </BasicPage>
    )
};