import React from 'react'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function DataTable(props) {
  return (
    <div style={{ flexGrow: 1, paddingTop:"5px" }}>
      <DataGrid
        {...props}
        autoHeight
        columns={props.columns}
        rows={props.rows}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  )
}
