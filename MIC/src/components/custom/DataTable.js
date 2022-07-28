import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function DataTable(props) {
	return (
		<div style={{ flexGrow: 1, paddingTop: "5px" }}>
			<DataGrid
				{...props}
				autoHeight
				components={{
					Toolbar: GridToolbar,
				}}
			/>
		</div>
	);
}
